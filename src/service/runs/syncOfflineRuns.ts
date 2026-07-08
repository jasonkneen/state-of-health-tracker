import {RunRecord} from '@data/models/RunRecord'
import {createRun} from '@queries/api/runs/createRun'
import {updateRun} from '@queries/api/runs/updateRun'
import offlineRunStorageService from '@service/runs/OfflineRunStorageService'
import CrashUtility from '@utility/CrashUtility'
import {isPermanentRejectionError, isServerFailureError} from '@utility/isServerFailureError'

const MAX_SYNC_ATTEMPTS = 3
// Bounds the per-launch network cost of a long-failing backlog: only this
// many parked runs (newest first) are resurrected per retryParked pass.
// Older parked runs stay stored and badged, they just stop costing requests.
const MAX_PARKED_RETRIES_PER_PASS = 10

const isParked = (run: RunRecord): boolean => !run.synced && !run.draft && (run.syncAttempts ?? 0) >= MAX_SYNC_ATTEMPTS

/**
 * Bounded-retry background sync of every unsynced local run. Mirrors
 * `syncOfflineWorkouts`, except it does not skip "today" — runs aren't scoped
 * to a calendar day the way a WorkoutDay is.
 *
 * - Drafts (awaiting the user's Save/Discard decision) are never pushed.
 * - Only server failures (5xx) burn an attempt; being offline retries
 *   indefinitely — losing signal for a weekend must never park a run. An
 *   offline error also aborts the whole pass: if one request can't reach the
 *   server, neither can the rest, so a backlog costs one request, not N.
 * - A run that fails MAX_SYNC_ATTEMPTS times (or the server rejects it with
 *   a 4xx) is parked (skipped, kept on disk) rather than deleted. Parking
 *   only means "stop hammering for now": callers pass `retryParked` to grant
 *   the newest MAX_PARKED_RETRIES_PER_PASS parked runs a fresh set of
 *   attempts (the Runs screen does this once per app launch), so recent runs
 *   are never abandoned and old failures never flood the network.
 */
export default async function syncOfflineRuns({retryParked = false}: {retryParked?: boolean} = {}): Promise<void> {
  const runs = await offlineRunStorageService.readAll()

  const resurrectedIds = new Set(
    retryParked
      ? runs
          .filter(isParked)
          .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))
          .slice(0, MAX_PARKED_RETRIES_PER_PASS)
          .map(run => run.localId)
      : []
  )

  for (const run of runs) {
    if (run.synced || run.draft) continue

    const attempts = resurrectedIds.has(run.localId) ? 0 : (run.syncAttempts ?? 0)

    if (attempts >= MAX_SYNC_ATTEMPTS) continue

    try {
      const result: RunRecord = run.id ? (await updateRun(run)).run : (await createRun(run)).run

      await offlineRunStorageService.save({
        ...result,
        synced: true,
        syncAttempts: 0
      })
    } catch (error) {
      CrashUtility.recordError(error)

      if (isPermanentRejectionError(error)) {
        // 4xx — retrying can never succeed, so park it immediately
        await offlineRunStorageService.save({...run, syncAttempts: MAX_SYNC_ATTEMPTS})
        continue
      }

      if (!isServerFailureError(error)) {
        // Network/unknown error (likely offline) — the remaining runs can't
        // reach the server either. Abort the pass; nobody's attempts burn.
        break
      }

      await offlineRunStorageService.save({
        ...run,
        syncAttempts: attempts + 1
      })
    }
  }

  await offlineRunStorageService.deleteAllSynced()
}

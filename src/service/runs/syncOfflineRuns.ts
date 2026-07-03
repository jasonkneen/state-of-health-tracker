import {RunRecord} from '@data/models/RunRecord'
import {createRun} from '@queries/api/runs/createRun'
import {updateRun} from '@queries/api/runs/updateRun'
import offlineRunStorageService from '@service/runs/OfflineRunStorageService'
import CrashUtility from '@utility/CrashUtility'

const MAX_SYNC_ATTEMPTS = 3

/**
 * Bounded-retry background sync of every unsynced local run. Mirrors
 * `syncOfflineWorkouts`, except it does not skip "today" — runs aren't scoped
 * to a calendar day the way a WorkoutDay is.
 *
 * - Drafts (awaiting the user's Save/Discard decision) are never pushed.
 * - A run that fails MAX_SYNC_ATTEMPTS times is parked (skipped, kept on
 *   disk) rather than deleted — a transient server outage must never destroy
 *   a user's run. Parked runs stay visible as pending and can be swiped away.
 */
export default async function syncOfflineRuns(): Promise<void> {
  const runs = await offlineRunStorageService.readAll()

  for (const run of runs) {
    if (run.synced || run.draft) continue
    if ((run.syncAttempts ?? 0) >= MAX_SYNC_ATTEMPTS) continue

    try {
      const result: RunRecord = run.id ? (await updateRun(run)).run : (await createRun(run)).run

      await offlineRunStorageService.save({
        ...result,
        synced: true,
        syncAttempts: 0
      })
    } catch (error) {
      CrashUtility.recordError(error)
      await offlineRunStorageService.save({
        ...run,
        syncAttempts: (run.syncAttempts ?? 0) + 1
      })
    }
  }

  await offlineRunStorageService.deleteAllSynced()
}

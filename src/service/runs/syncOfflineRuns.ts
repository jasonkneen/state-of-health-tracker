import {RunRecord} from '@data/models/RunRecord'
import {createRun} from '@service/runs/createRun'
import offlineRunStorageService from '@service/runs/OfflineRunStorageService'
import {updateRun} from '@service/runs/updateRun'

import {isServerFailureError} from '../../utility/isServerFailureError'

/**
 * Bounded-retry background sync of every unsynced local run. Mirrors
 * `syncOfflineWorkouts` exactly, except it does not skip "today" — runs
 * aren't scoped to a calendar day the way a WorkoutDay is, so every unsynced
 * run is a candidate.
 * - If a run syncs successfully, marks it as synced.
 * - If a run fails 3 times, drops it (rather than retrying forever).
 */
export default async function syncOfflineRuns(): Promise<void> {
  const runs = await offlineRunStorageService.readAll()

  for (const run of runs) {
    if (run.synced) continue

    try {
      const result: RunRecord = run.id ? (await updateRun(run)).run : (await createRun(run)).run

      await offlineRunStorageService.save({
        ...result,
        synced: true,
        syncAttempts: 0
      })
    } catch (err) {
      if (!isServerFailureError(err)) {
        continue
      }

      const attempts = (run.syncAttempts ?? 0) + 1

      if (attempts >= 3) {
        await offlineRunStorageService.deleteByLocalId(run.localId)
      } else {
        await offlineRunStorageService.save({
          ...run,
          syncAttempts: attempts
        })
      }
    }
  }

  // Clean up any records marked as synced
  await offlineRunStorageService.deleteAllSynced()
}

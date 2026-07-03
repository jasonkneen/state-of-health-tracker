import {RunRecord} from '@data/models/RunRecord'
import {createRun} from '@service/runs/createRun'
import {fetchRun} from '@service/runs/fetchRun'
import offlineRunStorageService from '@service/runs/OfflineRunStorageService'
import {updateRun} from '@service/runs/updateRun'

/**
 * Synchronizes a single local run (by `localId`) with the server —
 * single-run push/pull, last-write-wins on `updatedAt`. Mirrors
 * `syncWorkoutDay`'s shape, but keyed by `localId` instead of a calendar
 * date since runs aren't "one per day".
 *
 * - No local record → returns null (nothing to sync).
 * - Never synced (no remote id) → pushes as a create.
 * - Has a remote id → fetches the remote copy; if local is newer and
 *   unsynced, pushes local -> remote; otherwise pulls remote -> local.
 * - Any network failure falls back to the existing local copy rather than
 *   losing the run.
 */
export async function syncRun(localId: string): Promise<RunRecord | null> {
  const local = await offlineRunStorageService.findLocalRunByLocalId(localId)

  if (!local) {
    return null
  }

  if (!local.id) {
    try {
      const {run: created} = await createRun(local)

      await offlineRunStorageService.save(created)

      return created
    } catch (error) {
      console.warn('[SyncRun] Failed to create remote run — keeping local', error)

      return local
    }
  }

  try {
    const remote = await fetchRun(local.id)

    if (!remote) {
      // Remote copy is gone (deleted server-side, or the id no longer
      // resolves) — re-create from the local copy rather than losing it.
      const {run: created} = await createRun(local)

      await offlineRunStorageService.save(created)

      return created
    }

    if (!local.synced && local.updatedAt > remote.updatedAt) {
      const {run: updated} = await updateRun({...local, id: remote.id})

      await offlineRunStorageService.save(updated)

      return updated
    }

    await offlineRunStorageService.save(remote)

    return remote
  } catch (error) {
    console.warn('[SyncRun] Failed to fetch remote run — using local', error)

    return local
  }
}

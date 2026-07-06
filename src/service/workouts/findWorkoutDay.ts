import {createWorkoutDay, WorkoutDay} from '@data/models/WorkoutDay'
import {fetchWorkoutForDay} from '@queries/api/workouts/fetchWorkoutForDay'
import offlineWorkoutStorageService from '@service/workouts/OfflineWorkoutStorageService'

/**
 * Read-only lookup of a workout day for viewing, without the push/merge side
 * of syncWorkoutDay. The local copy wins when present (unsynced edits live
 * there), the server fills days this device has never seen, and the empty
 * fallback is intentionally NOT persisted — viewing a day must not create
 * records.
 */
export async function findWorkoutDay(dateIso: string, userId: string): Promise<WorkoutDay> {
  const local = await offlineWorkoutStorageService.findLocalWorkoutByDate(dateIso)

  if (local) return local

  try {
    const remote = await fetchWorkoutForDay(dateIso)

    if (remote) return remote
  } catch {
    // fetchWorkoutForDay already records the error; offline just falls through
  }

  return createWorkoutDay(userId, dateIso)
}

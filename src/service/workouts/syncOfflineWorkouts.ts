import {WorkoutDay} from '@data/models/WorkoutDay'
import {saveWorkoutDay} from '@queries/api/workouts/saveWorkoutDay'
import {updateWorkoutDay} from '@queries/api/workouts/updateWorkoutDay'
import {compareIsoDateStrings, getPreviousDayISO} from '@utility/DateUtility'
import {isServerFailureError} from '@utility/isServerFailureError'

import offlineWorkoutStorageService from './OfflineWorkoutStorageService'

/**
 * Attempts to sync all unsynced workouts that are not from today.
 * - If a workout syncs successfully, marks it as synced.
 * - If a workout fails 3 times, deletes it.
 * Synced workouts from yesterday onward are kept locally so the workout
 * day pager can load them without a network round-trip.
 * @param todayISO - ISO date string (e.g., '2025-10-20')
 */
export default async function syncOfflineWorkouts(todayISO: string) {
  const workouts = await offlineWorkoutStorageService.readAll()

  for (const workout of workouts) {
    if (compareIsoDateStrings(workout.date, todayISO)) continue

    if (workout.synced) continue

    try {
      let modifiedWorkout: WorkoutDay

      if (workout.id) {
        modifiedWorkout = await updateWorkoutDay(workout)
      } else {
        modifiedWorkout = await saveWorkoutDay(workout)
      }

      if (modifiedWorkout) {
        await offlineWorkoutStorageService.save({
          ...workout,
          synced: true,
          syncAttempts: 0
        })
      }
    } catch (err) {
      if (!isServerFailureError(err)) {
        continue
      }

      const attempts = (workout.syncAttempts ?? 0) + 1

      if (attempts >= 3) {
        await offlineWorkoutStorageService.deleteByDate(workout.date)
      } else {
        await offlineWorkoutStorageService.save({
          ...workout,
          syncAttempts: attempts
        })
      }
    }
  }

  await offlineWorkoutStorageService.deleteAllSynced(getPreviousDayISO(todayISO))
}

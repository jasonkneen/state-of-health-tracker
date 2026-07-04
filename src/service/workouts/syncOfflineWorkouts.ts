import {WorkoutDay} from '@data/models/WorkoutDay'
import {saveWorkoutDay} from '@queries/api/workouts/saveWorkoutDay'
import {updateWorkoutDay} from '@queries/api/workouts/updateWorkoutDay'
import {compareIsoDateStrings, getPreviousDayISO} from '@utility/DateUtility'
import {isPermanentRejectionError, isServerFailureError} from '@utility/isServerFailureError'

import offlineWorkoutStorageService from './OfflineWorkoutStorageService'

const MAX_SYNC_ATTEMPTS = 3

/**
 * Attempts to sync all unsynced workouts that are not from today.
 * - If a workout syncs successfully, marks it as synced.
 * - If a workout fails MAX_SYNC_ATTEMPTS times (or the server rejects it with
 *   a 4xx), it is parked (skipped, kept on disk) rather than deleted — a
 *   transient server outage must never destroy a user's workout.
 * Synced workouts from yesterday onward are kept locally so the workout
 * day pager can load them without a network round-trip.
 * @param todayISO - ISO date string (e.g., '2025-10-20')
 */
export default async function syncOfflineWorkouts(todayISO: string) {
  const workouts = await offlineWorkoutStorageService.readAll()

  // Merges only the sync bookkeeping fields into the *currently stored*
  // workout: a user edit landing after the readAll() snapshot above must not
  // be overwritten by writing the stale snapshot copy back.
  const saveSyncFields = async (workout: WorkoutDay, fields: Pick<WorkoutDay, 'id' | 'synced' | 'syncAttempts'>) => {
    const current = await offlineWorkoutStorageService.findLocalWorkoutByDate(workout.date)

    await offlineWorkoutStorageService.save({
      ...(current ?? workout),
      ...fields
    })
  }

  for (const workout of workouts) {
    if (compareIsoDateStrings(workout.date, todayISO)) continue

    if (workout.synced) continue

    // Parked: stopped retrying, but the data is kept
    if ((workout.syncAttempts ?? 0) >= MAX_SYNC_ATTEMPTS) continue

    try {
      let modifiedWorkout: WorkoutDay

      if (workout.id) {
        modifiedWorkout = await updateWorkoutDay(workout)
      } else {
        modifiedWorkout = await saveWorkoutDay(workout)
      }

      if (modifiedWorkout) {
        await saveSyncFields(workout, {
          // Keep the server-assigned id — losing it would make the next edit
          // POST again and create a duplicate workout day
          id: modifiedWorkout.id ?? workout.id,
          synced: true,
          syncAttempts: 0
        })
      }
    } catch (err) {
      if (isPermanentRejectionError(err)) {
        // 4xx — retrying can never succeed, so park it immediately
        await saveSyncFields(workout, {syncAttempts: MAX_SYNC_ATTEMPTS})
        continue
      }

      if (!isServerFailureError(err)) {
        // Network/unknown error (likely offline) — retry next pass without
        // burning an attempt
        continue
      }

      await saveSyncFields(workout, {syncAttempts: (workout.syncAttempts ?? 0) + 1})
    }
  }

  await offlineWorkoutStorageService.deleteAllSynced(getPreviousDayISO(todayISO))
}

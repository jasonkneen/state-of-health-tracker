import {WorkoutDay} from '@data/models/WorkoutDay'
import {saveWorkoutDay} from '@queries/api/workouts/saveWorkoutDay'
import {updateWorkoutDay} from '@queries/api/workouts/updateWorkoutDay'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

const pushWorkoutDay = (workout: WorkoutDay) => (workout.id ? updateWorkoutDay(workout) : saveWorkoutDay(workout))

// Orchestrates completing the daily workout: the store records the completion
// locally, this mutation pushes it to the server and refreshes the
// weekly summary + history so they update without waiting for the next
// app-open sync.
export const useCompleteWorkoutMutation = () => {
  const queryClient = useQueryClient()

  const markWorkoutCompleted = useDailyWorkoutEntryStore(state => state.markWorkoutCompleted)
  const setWorkoutDayId = useDailyWorkoutEntryStore(state => state.setWorkoutDayId)

  return useMutation({
    mutationKey: mutationKeys.completeWorkout,
    mutationFn: async () => {
      markWorkoutCompleted()

      const workout = useDailyWorkoutEntryStore.getState().currentWorkoutDay

      if (!workout) return null

      return pushWorkoutDay(workout)
    },
    onSuccess: remote => {
      const workout = useDailyWorkoutEntryStore.getState().currentWorkoutDay

      if (remote?.id && workout && !workout.id) {
        setWorkoutDayId(remote.id)
      }

      queryClient.invalidateQueries({queryKey: queryKeys.weeklyWorkoutSummaries})
      queryClient.invalidateQueries({queryKey: queryKeys.workoutSummaries})
    }
  })
}

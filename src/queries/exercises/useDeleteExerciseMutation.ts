import {deleteExercise} from '@queries/api/exercises/deleteExercise'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useDeleteExerciseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.deleteExercise,
    mutationFn: deleteExercise,
    onSuccess: (_, exerciseId) => {
      // Templates reference exercises by id, so both caches must refresh
      queryClient.invalidateQueries({queryKey: queryKeys.exercises})
      queryClient.invalidateQueries({queryKey: queryKeys.templates})
      // Records and history may still reference the deleted exercise
      queryClient.invalidateQueries({queryKey: queryKeys.records})
      queryClient.invalidateQueries({queryKey: queryKeys.exerciseHistory(exerciseId)})
    }
  })
}

import {deleteExercise} from '@service/exercises/deleteExercise'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useDeleteExerciseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.deleteExercise,
    mutationFn: deleteExercise,
    onSuccess: () => {
      // Templates reference exercises by id, so both caches must refresh
      queryClient.invalidateQueries({queryKey: queryKeys.exercises})
      queryClient.invalidateQueries({queryKey: queryKeys.templates})
    }
  })
}

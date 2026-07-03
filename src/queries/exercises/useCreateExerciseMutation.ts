import {Exercise} from '@data/models/Exercise'
import {createExercise} from '@service/exercises/createExercise'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useCreateExerciseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.createExercise,
    mutationFn: createExercise,
    onSuccess: created => {
      queryClient.setQueryData<Exercise[]>(queryKeys.exercises, previous =>
        previous ? [...previous, created] : [created]
      )
    }
  })
}

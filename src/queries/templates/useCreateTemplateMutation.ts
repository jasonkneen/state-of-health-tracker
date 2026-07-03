import {ExerciseTemplate} from '@data/models/ExerciseTemplate'
import {createTemplate} from '@service/exercises/createTemplate'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useCreateTemplateMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.createTemplate,
    mutationFn: createTemplate,
    onSuccess: created => {
      queryClient.setQueryData<ExerciseTemplate[]>(queryKeys.templates, previous =>
        previous ? [...previous, created] : [created]
      )
    }
  })
}

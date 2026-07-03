import {deleteTemplate} from '@service/exercises/deleteTemplate'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useDeleteTemplateMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.deleteTemplate,
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.templates})
    }
  })
}

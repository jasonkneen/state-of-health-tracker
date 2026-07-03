import {WeighIn} from '@data/models/WeighIn'
import {deleteWeighIn} from '@queries/api/weighIns/deleteWeighIn'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useDeleteWeighInMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.deleteWeighIn,
    mutationFn: deleteWeighIn,
    onSuccess: (_, weighInId) => {
      queryClient.setQueryData<WeighIn[]>(queryKeys.weighIns, current =>
        (current ?? []).filter(weighIn => weighIn.id !== weighInId)
      )
    }
  })
}

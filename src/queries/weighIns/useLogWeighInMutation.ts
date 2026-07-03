import {WeighIn} from '@data/models/WeighIn'
import {logWeighIn} from '@queries/api/weighIns/logWeighIn'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useLogWeighInMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.logWeighIn,
    mutationFn: logWeighIn,
    onSuccess: created => {
      queryClient.setQueryData<WeighIn[]>(queryKeys.weighIns, current =>
        [created, ...(current ?? [])].sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))
      )
    }
  })
}

import offlineRunStorageService from '@service/runs/OfflineRunStorageService'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

/** Deletes a local (unsynced/draft) run from the offline queue. */
export const useDiscardRunMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.discardRun,
    mutationFn: (localId: string) => offlineRunStorageService.deleteByLocalId(localId),
    onSuccess: (_, localId) => {
      queryClient.removeQueries({queryKey: queryKeys.run(localId)})
      queryClient.invalidateQueries({queryKey: queryKeys.runs})
    }
  })
}

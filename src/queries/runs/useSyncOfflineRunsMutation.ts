import syncOfflineRuns from '@service/runs/syncOfflineRuns'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

/** Background push of unsynced local runs; refreshes the runs list when done. */
export const useSyncOfflineRunsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.syncOfflineRuns,
    mutationFn: syncOfflineRuns,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.runs})
      queryClient.invalidateQueries({queryKey: queryKeys.runsTotal})
    }
  })
}

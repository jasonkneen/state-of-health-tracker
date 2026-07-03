import {RunRecord} from '@data/models/RunRecord'
import {fetchRun} from '@queries/api/runs/fetchRun'
import offlineRunStorageService from '@service/runs/OfflineRunStorageService'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

/**
 * Loads a single run local-first: the offline queue still holds pending/draft
 * runs, everything else lives on the server. A pending run is never fetched
 * remotely — if it isn't in the queue it doesn't exist anywhere.
 */
export const useRunRecordQuery = (runId: string, pending: boolean) =>
  useQuery<RunRecord | null>({
    queryKey: queryKeys.run(runId),
    queryFn: async () => {
      const local = await offlineRunStorageService.findLocalRunByLocalId(runId)

      if (local) {
        return local
      }

      return pending ? null : fetchRun(runId)
    }
  })

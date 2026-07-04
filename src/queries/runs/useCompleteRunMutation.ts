import {RunPersonalRecord} from '@data/models/RunPersonalRecord'
import {RunRecord} from '@data/models/RunRecord'
import {createRun} from '@queries/api/runs/createRun'
import {updateRun} from '@queries/api/runs/updateRun'
import offlineRunStorageService from '@service/runs/OfflineRunStorageService'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'

import {mutationKeys, queryKeys} from '../keys'

const pushRun = (run: RunRecord) => (run.id ? updateRun(run) : createRun(run))

export interface CompleteRunResult {
  run: RunRecord
  newRecords: RunPersonalRecord[]
}

// Orchestrates saving a reviewed run: clears the draft flag and persists
// locally first (so the run survives even if the network push fails or the
// app is offline), then pushes it to the server and refreshes the runs list.
// Mirrors useCompleteWorkoutMutation's shape.
export const useCompleteRunMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.completeRun,
    mutationFn: async (run: RunRecord): Promise<CompleteRunResult> => {
      const confirmed: RunRecord = {...run, draft: false}

      await offlineRunStorageService.save(confirmed)

      try {
        const {run: synced, newRecords} = await pushRun(confirmed)

        await offlineRunStorageService.save(synced)

        return {run: synced, newRecords}
      } catch (error) {
        // Genuinely offline (no HTTP response) — the run is safely stored
        // locally and will be picked up by syncOfflineRuns on a later app
        // open/foreground, so report success as "queued offline".
        if (axios.isAxiosError(error) && !error.response) {
          return {run: confirmed, newRecords: []}
        }

        // The server responded with an error — rethrow so onError fires
        // instead of silently reporting success.
        throw error
      }
    },
    onSuccess: (_, run) => {
      queryClient.invalidateQueries({queryKey: queryKeys.run(run.localId)})
      queryClient.invalidateQueries({queryKey: queryKeys.runs})
      queryClient.invalidateQueries({queryKey: queryKeys.runsTotal})
    }
  })
}

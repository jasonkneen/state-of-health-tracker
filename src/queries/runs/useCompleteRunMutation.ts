import {RunPersonalRecord} from '@data/models/RunPersonalRecord'
import {RunRecord} from '@data/models/RunRecord'
import {createRun} from '@service/runs/createRun'
import offlineRunStorageService from '@service/runs/OfflineRunStorageService'
import {updateRun} from '@service/runs/updateRun'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

const pushRun = (run: RunRecord) => (run.id ? updateRun(run) : createRun(run))

export interface CompleteRunResult {
  run: RunRecord
  newRecords: RunPersonalRecord[]
}

// Orchestrates completing a run: saves the finished RunRecord locally first
// (so the run survives even if the network push fails or the app is
// offline), then pushes it to the server and refreshes the runs list +
// weekly summary. Mirrors useCompleteWorkoutMutation's shape. The caller
// (RunSummary screen) is responsible for calling `runSessionService.discard`
// once this resolves, per RunSessionService.stop()'s contract — this hook
// only knows about the sync/storage layer, not the session/buffer.
export const useCompleteRunMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.completeRun,
    mutationFn: async (run: RunRecord): Promise<CompleteRunResult> => {
      await offlineRunStorageService.save(run)

      try {
        const {run: synced, newRecords} = await pushRun(run)

        await offlineRunStorageService.save(synced)

        return {run: synced, newRecords}
      } catch (error) {
        // Network push failed — the run is safely stored locally and will
        // be picked up by syncOfflineRuns on a later app open/foreground.
        return {run, newRecords: []}
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.runs})
      queryClient.invalidateQueries({queryKey: queryKeys.weeklyRunSummary})
    }
  })
}

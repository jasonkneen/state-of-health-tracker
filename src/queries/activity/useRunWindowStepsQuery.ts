import {RunRecord} from '@data/models/RunRecord'
import {getStepsInWindow} from '@service/health/healthService'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

const MS_PER_SECOND = 1000

const runWindowEnd = (run: RunRecord): Date =>
  run.endedAt
    ? new Date(run.endedAt)
    : new Date(new Date(run.startedAt).getTime() + run.durationSeconds * MS_PER_SECOND)

/**
 * Steps recorded inside each run's time window, keyed by the run's localId —
 * these are subtracted from step-calorie attribution since the run's own
 * calorie value already covers that movement.
 */
export const useRunWindowStepsQuery = (runs: RunRecord[], enabled: boolean) => {
  const runsKey = runs
    .map(run => run.localId)
    .sort()
    .join(',')

  return useQuery({
    queryKey: queryKeys.runWindowSteps(runsKey),
    queryFn: async (): Promise<Record<string, number>> => {
      const entries = await Promise.all(
        runs.map(
          async run => [run.localId, await getStepsInWindow(new Date(run.startedAt), runWindowEnd(run))] as const
        )
      )

      return Object.fromEntries(entries)
    },
    enabled: enabled && runs.length > 0
  })
}

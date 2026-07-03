import {fetchWeeklyRunSummary} from '@queries/api/runs/fetchWeeklyRunSummary'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useWeeklyRunSummaryQuery = () =>
  useQuery({
    queryKey: queryKeys.weeklyRunSummary,
    queryFn: () => fetchWeeklyRunSummary()
  })

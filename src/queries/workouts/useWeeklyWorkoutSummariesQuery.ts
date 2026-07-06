import {fetchWeeklyWorkoutSummaries} from '@queries/api/workouts/fetchWeeklyWorkoutSummaries'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useWeeklyWorkoutSummariesQuery = () =>
  useQuery({
    queryKey: queryKeys.weeklyWorkoutSummaries,
    queryFn: fetchWeeklyWorkoutSummaries
  })

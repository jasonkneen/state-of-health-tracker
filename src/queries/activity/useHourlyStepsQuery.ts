import {getHourlySteps} from '@service/health/healthService'
import {useQuery} from '@tanstack/react-query'
import {subDays, startOfDay} from 'date-fns'

import {queryKeys} from '../keys'

const HOURLY_STEPS_STALE_TIME_MS = 5 * 60_000

export const useHourlyStepsQuery = (days: number, enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.hourlySteps(days),
    queryFn: () => {
      const now = new Date()

      return getHourlySteps(subDays(startOfDay(now), days - 1), now)
    },
    enabled,
    staleTime: HOURLY_STEPS_STALE_TIME_MS
  })

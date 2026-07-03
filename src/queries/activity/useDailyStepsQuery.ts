import {getDailySteps} from '@service/health/healthService'
import {useQuery} from '@tanstack/react-query'
import {subDays, startOfDay} from 'date-fns'

import {queryKeys} from '../keys'

// Today's count should feel live while the Activity tab is on screen; the
// query only exists while mounted, so a modest interval is enough (HealthKit
// observers are a later optimization).
const STEPS_REFETCH_INTERVAL_MS = 60_000

export const useDailyStepsQuery = (days: number, enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.dailySteps(days),
    queryFn: () => {
      const now = new Date()

      return getDailySteps(subDays(startOfDay(now), days - 1), now)
    },
    enabled,
    refetchInterval: STEPS_REFETCH_INTERVAL_MS
  })

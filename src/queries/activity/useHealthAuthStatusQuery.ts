import {shouldRequestStepPermissions} from '@service/health/healthService'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

/** True while iOS still needs to show the HealthKit permission sheet. */
export const useHealthAuthStatusQuery = (enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.healthAuthStatus,
    queryFn: shouldRequestStepPermissions,
    enabled
  })

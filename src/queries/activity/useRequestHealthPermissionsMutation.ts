import {requestStepPermissions} from '@service/health/healthService'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useRequestHealthPermissionsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.requestHealthPermissions,
    mutationFn: requestStepPermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.healthAuthStatus})
      queryClient.invalidateQueries({queryKey: queryKeys.activitySteps})
    }
  })
}

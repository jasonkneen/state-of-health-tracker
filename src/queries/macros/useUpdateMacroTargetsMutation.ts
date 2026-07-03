import {DailyMacros} from '@data/models/DailyMacros'
import {updateMacroTargets} from '@queries/api/macros/updateMacroTargets'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useUpdateMacroTargetsMutation = (date: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.updateMacroTargets,
    mutationFn: updateMacroTargets,
    onSuccess: targets => {
      queryClient.setQueryData<DailyMacros>(queryKeys.dailyMacros(date), current =>
        current ? {...current, targets} : current
      )
    }
  })
}

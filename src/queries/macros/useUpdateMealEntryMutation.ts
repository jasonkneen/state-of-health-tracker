import {UpdateMealEntryPayload} from '@data/models/MealEntry'
import {updateMealEntry} from '@queries/api/macros/updateMealEntry'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useUpdateMealEntryMutation = (date: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.updateMealEntry,
    mutationFn: ({entryId, payload}: {entryId: string; payload: UpdateMealEntryPayload}) =>
      updateMealEntry(entryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.dailyMacros(date)})
      queryClient.invalidateQueries({queryKey: queryKeys.macrosHistory})
    }
  })
}

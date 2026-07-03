import {LogMealEntryPayload} from '@data/models/MealEntry'
import {logMealEntry} from '@queries/api/macros/logMealEntry'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useLogMealEntryMutation = (date: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.logMealEntry,
    mutationFn: ({mealId, payload}: {mealId: string; payload: LogMealEntryPayload}) => logMealEntry(mealId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.dailyMacros(date)})
      queryClient.invalidateQueries({queryKey: queryKeys.macrosHistory})
    }
  })
}

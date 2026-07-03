import {deleteMealEntry} from '@queries/api/macros/deleteMealEntry'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useDeleteMealEntryMutation = (date: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.deleteMealEntry,
    mutationFn: (entryId: string) => deleteMealEntry(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.dailyMacros(date)})
      queryClient.invalidateQueries({queryKey: queryKeys.macrosHistory})
    }
  })
}

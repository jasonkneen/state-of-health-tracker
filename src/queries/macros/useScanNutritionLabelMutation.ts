import {scanNutritionLabel} from '@queries/api/macros/scanNutritionLabel'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

// The scan result prefills the New Food form and persists nothing (the food
// is created via useCreateFoodMutation) — but each call consumes one unit of
// the free daily AI quota, so the usage meter is refreshed.
export const useScanNutritionLabelMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.scanNutritionLabel,
    mutationFn: scanNutritionLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.aiUsage})
    }
  })
}

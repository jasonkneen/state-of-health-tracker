import {scanNutritionLabel} from '@queries/api/macros/scanNutritionLabel'
import {useMutation} from '@tanstack/react-query'

import {mutationKeys} from '../keys'

// No cache writes — the scan result prefills the New Food form; the food is
// only persisted when the user confirms via useCreateFoodMutation.
export const useScanNutritionLabelMutation = () =>
  useMutation({
    mutationKey: mutationKeys.scanNutritionLabel,
    mutationFn: scanNutritionLabel
  })

import {estimateMacros} from '@queries/api/macros/estimateMacros'
import {useMutation} from '@tanstack/react-query'

import {mutationKeys} from '../keys'

// No cache writes — the estimate feeds the review UI; nothing is persisted
// until the user confirms and entries are logged via useLogMealEntryMutation.
export const useEstimateMacrosMutation = () =>
  useMutation({
    mutationKey: mutationKeys.estimateMacros,
    mutationFn: estimateMacros
  })

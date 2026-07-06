import {fetchAiUsage} from '@queries/api/macros/fetchAiUsage'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useAiUsageQuery = () =>
  useQuery({
    queryKey: queryKeys.aiUsage,
    queryFn: fetchAiUsage
  })

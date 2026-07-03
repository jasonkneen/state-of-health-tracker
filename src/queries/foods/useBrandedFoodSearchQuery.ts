import {searchBrandedFoods} from '@queries/api/foods/searchBrandedFoods'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useBrandedFoodSearchQuery = (query: string) =>
  useQuery({
    queryKey: queryKeys.brandedFoodSearch(query),
    queryFn: () => searchBrandedFoods(query),
    enabled: query.trim().length > 2,
    staleTime: 5 * 60_000
  })

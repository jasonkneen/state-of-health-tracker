import {fetchFoods} from '@queries/api/foods/fetchFoods'
import {useInfiniteQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useFoodsInfiniteQuery = (query: string) =>
  useInfiniteQuery({
    queryKey: queryKeys.foodSearch(query),
    queryFn: ({pageParam}) => fetchFoods(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPageParam < lastPage.pagination.totalPages ? lastPageParam + 1 : undefined
  })

import {fetchMacrosHistory} from '@queries/api/macros/fetchMacrosHistory'
import {useInfiniteQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useMacrosHistoryInfiniteQuery = () =>
  useInfiniteQuery({
    queryKey: queryKeys.macrosHistory,
    queryFn: ({pageParam}) => fetchMacrosHistory(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPageParam < lastPage.pagination.totalPages ? lastPageParam + 1 : undefined
  })

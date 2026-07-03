import {fetchWorkoutSummaries} from '@service/workouts/fetchWorkoutSummaries'
import {useInfiniteQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useWorkoutSummariesInfiniteQuery = () =>
  useInfiniteQuery({
    queryKey: queryKeys.workoutSummaries,
    queryFn: ({pageParam}) => fetchWorkoutSummaries(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPageParam < lastPage.pagination.totalPages ? lastPageParam + 1 : undefined
  })

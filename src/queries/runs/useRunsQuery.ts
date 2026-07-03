import {fetchRuns} from '@service/runs/fetchRuns'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useRunsQuery = () =>
  useQuery({
    queryKey: queryKeys.runs,
    queryFn: () => fetchRuns()
  })

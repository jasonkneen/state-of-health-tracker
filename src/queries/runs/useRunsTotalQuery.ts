import {fetchRunsTotal} from '@queries/api/runs/fetchRunsTotal'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useRunsTotalQuery = () =>
  useQuery({
    queryKey: queryKeys.runsTotal,
    queryFn: fetchRunsTotal
  })

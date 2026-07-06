import {fetchWeighIns} from '@queries/api/weighIns/fetchWeighIns'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useWeighInsQuery = () =>
  useQuery({
    queryKey: queryKeys.weighIns,
    queryFn: fetchWeighIns
  })

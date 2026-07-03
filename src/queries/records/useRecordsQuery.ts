import {fetchRecords} from '@service/records/fetchRecords'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useRecordsQuery = () =>
  useQuery({
    queryKey: queryKeys.records,
    queryFn: fetchRecords
  })

import {fetchExerciseHistory} from '@queries/api/records/fetchExerciseHistory'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useExerciseHistoryQuery = (exerciseId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.exerciseHistory(exerciseId ?? ''),
    queryFn: () => fetchExerciseHistory(exerciseId as string),
    enabled: !!exerciseId
  })

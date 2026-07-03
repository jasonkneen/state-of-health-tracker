import {fetchExercises} from '@service/exercises/fetchExercises'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useExercisesQuery = () =>
  useQuery({
    queryKey: queryKeys.exercises,
    queryFn: fetchExercises
  })

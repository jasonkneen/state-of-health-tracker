import {fetchMacrosForDay} from '@queries/api/macros/fetchMacrosForDay'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useDailyMacrosQuery = (date: string) =>
  useQuery({queryKey: queryKeys.dailyMacros(date), queryFn: () => fetchMacrosForDay(date)})

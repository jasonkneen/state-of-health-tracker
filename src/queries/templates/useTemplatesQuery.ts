import {fetchTemplates} from '@service/exercises/fetchTemplates'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

export const useTemplatesQuery = () =>
  useQuery({
    queryKey: queryKeys.templates,
    queryFn: fetchTemplates
  })

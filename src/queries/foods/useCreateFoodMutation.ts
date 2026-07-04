import {createFood} from '@queries/api/foods/createFood'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useCreateFoodMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.createFood,
    mutationFn: createFood,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.foods})
    }
  })
}

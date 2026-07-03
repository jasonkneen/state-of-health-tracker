import {createFood} from '@queries/api/foods/createFood'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys} from '../keys'

export const useCreateFoodMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.createFood,
    mutationFn: createFood,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['foods']})
    }
  })
}

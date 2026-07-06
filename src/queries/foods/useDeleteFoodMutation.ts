import {deleteFood} from '@queries/api/foods/deleteFood'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useDeleteFoodMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.deleteFood,
    mutationFn: deleteFood,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.foods})
    }
  })
}

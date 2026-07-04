import {updateAvatar} from '@queries/api/user/updateAvatar'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {mutationKeys, queryKeys} from '../keys'

export const useUpdateAvatarMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.updateAvatar,
    mutationFn: updateAvatar,
    onSuccess: avatarBase64 => {
      queryClient.setQueryData(queryKeys.userAvatar, avatarBase64)
    }
  })
}

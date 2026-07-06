import {fetchAvatar} from '@queries/api/user/fetchAvatar'
import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

// The endpoint requires a session — callers pass isAuthed so guests never fetch.
export const useUserAvatarQuery = (enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.userAvatar,
    queryFn: fetchAvatar,
    enabled
  })

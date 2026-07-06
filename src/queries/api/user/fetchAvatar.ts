import {httpGet} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

const AvatarResponse = io.type({
  avatarBase64: io.union([io.string, io.null])
})

export async function fetchAvatar(): Promise<string | null> {
  try {
    const response = await httpGet(Endpoints.UserAvatar, AvatarResponse)

    if (!response?.data) throw new Error('No avatar response')

    return response.data.avatarBase64
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

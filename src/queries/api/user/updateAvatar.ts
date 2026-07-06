import {httpPut} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

const AvatarResponse = io.type({
  avatarBase64: io.union([io.string, io.null])
})

export async function updateAvatar(avatarBase64: string | null): Promise<string | null> {
  try {
    const response = await httpPut(Endpoints.UserAvatar, AvatarResponse, {avatarBase64})

    if (response?.status !== 200 || !response.data) {
      throw new Error(`Unexpected response updating avatar: status=${response?.status}`)
    }

    return response.data.avatarBase64
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

import {LogWeighInPayload, WeighIn} from '@data/models/WeighIn'
import {httpPost} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'

import Endpoints from '@constants/endpoints'

import {WeighInResponse} from './decoder/WeighInDecoder'

export async function logWeighIn(payload: LogWeighInPayload): Promise<WeighIn> {
  try {
    const response = await httpPost(Endpoints.WeighIn, WeighInResponse, payload)

    if (!response || !response.data) {
      throw new Error('Invalid response when logging weigh-in')
    }

    return response.data
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

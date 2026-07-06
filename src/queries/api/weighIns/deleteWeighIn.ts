import {httpDelete} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

const VoidResponse = io.unknown

export async function deleteWeighIn(weighInId: string): Promise<boolean> {
  try {
    const response = await httpDelete(`${Endpoints.WeighIn}${weighInId}`, VoidResponse)

    if (response?.status !== 200) {
      throw new Error(`Unexpected response status: ${response?.status}`)
    }

    return true
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

import {AiUsage} from '@data/models/AiUsage'
import {httpGet} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

const AiUsageResponse = io.type({
  used: io.number,
  limit: io.number,
  resetsAt: io.string,
  unlimited: io.boolean
})

export async function fetchAiUsage(): Promise<AiUsage> {
  try {
    const response = await httpGet(Endpoints.AiUsage, AiUsageResponse)

    if (response?.status !== 200 || !response.data) {
      throw new Error(`Unexpected response fetching AI usage: status=${response?.status}`)
    }

    return response.data
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

import {DailyMacros} from '@data/models/DailyMacros'
import {convertDailyMacros} from '@queries/api/macros/converter/convertDailyMacros'
import {DailyMacrosResponse} from '@queries/api/macros/decoder/MacrosDecoder'
import {httpGet} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'

import Endpoints from '@constants/endpoints'

export async function fetchMacrosForDay(date: string): Promise<DailyMacros> {
  try {
    const response = await httpGet(Endpoints.DailyMacros(date), DailyMacrosResponse)

    if (response?.status !== 200 || !response.data) {
      throw new Error(`Unexpected response fetching macros: status=${response?.status}`)
    }

    return convertDailyMacros(response.data)
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

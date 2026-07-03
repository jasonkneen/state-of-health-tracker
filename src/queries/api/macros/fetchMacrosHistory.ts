import {DailySummary} from '@data/models/DailyMacros'
import {PaginationResponse} from '@queries/api/macros/decoder/MacrosDecoder'
import {httpGet} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

const DailySummaryResponse = io.type({
  date: io.string,
  mealCount: io.number,
  calories: io.number,
  protein: io.number,
  carbs: io.number,
  fat: io.number
})

const MacrosHistoryResponse = io.type({
  days: io.array(DailySummaryResponse),
  pagination: PaginationResponse
})

export interface MacrosHistoryPage {
  days: DailySummary[]
  pagination: io.TypeOf<typeof PaginationResponse>
}

export async function fetchMacrosHistory(page: number, limit: number = 30): Promise<MacrosHistoryPage> {
  try {
    const url = `${Endpoints.MacrosHistory}?page=${page}&limit=${limit}`
    const response = await httpGet(url, MacrosHistoryResponse)

    if (response?.status !== 200 || !response.data) {
      throw new Error(`Unexpected response fetching macros history: status=${response?.status}`)
    }

    return response.data
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

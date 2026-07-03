import {WeeklyRunSummariesResponse} from '@queries/api/runs/decoder/RunDecoder'
import {httpGet} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'

import Endpoints from '@constants/endpoints'

export interface WeeklyRunSummary {
  startOfWeek: string
  totalRuns: number
  totalDistanceMeters: number
}

/** Defaults to 7 weeks, mirroring Endpoints.WeeklyRunSummary's convenience default. */
export async function fetchWeeklyRunSummary(numOfWeeks: number = 7): Promise<WeeklyRunSummary[]> {
  try {
    const response = await httpGet(Endpoints.WeeklyRunSummary(numOfWeeks), WeeklyRunSummariesResponse)

    const data = response?.data

    if (!Array.isArray(data)) {
      throw new Error('Invalid weekly run summary response')
    }

    return data
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

import {ExerciseHistoryResponse} from '@data/decoders/ExerciseHistoryDecoder'
import {ExerciseHistoryEntry} from '@data/models/PersonalRecord'
import {httpGet} from '@service/http/httpUtil'

import Endpoints from '@constants/endpoints'

import CrashUtility from '../../utility/CrashUtility'

// A single page is enough for the trend chart / recent-sessions list — this
// isn't a paginated list UI, it's a fixed lookback window.
const HISTORY_PAGE_LIMIT = 200

export async function fetchExerciseHistory(exerciseId: string): Promise<ExerciseHistoryEntry[]> {
  try {
    const url = `${Endpoints.ExerciseHistory(exerciseId)}?limit=${HISTORY_PAGE_LIMIT}`
    const response = await httpGet(url, ExerciseHistoryResponse)

    const data = response?.data

    if (!data) throw new Error('No exercise history found')

    return data.history
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

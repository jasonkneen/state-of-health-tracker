import {ExerciseHistoryEntry} from '@data/models/PersonalRecord'
import {httpGet} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

const ExerciseHistoryEntryResponse = io.type({
  setId: io.string,
  date: io.string,
  reps: io.union([io.number, io.null]),
  weight: io.union([io.number, io.null]),
  addedWeight: io.union([io.number, io.null]),
  durationSeconds: io.union([io.number, io.null]),
  distanceMeters: io.union([io.number, io.null]),
  rpe: io.union([io.number, io.null])
})

const Pagination = io.type({
  page: io.number,
  limit: io.number,
  total: io.number,
  totalPages: io.number
})

const ExerciseHistoryResponse = io.type({
  history: io.array(ExerciseHistoryEntryResponse),
  pagination: Pagination
})

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

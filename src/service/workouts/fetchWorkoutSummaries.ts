import {Pagination} from '@data/models/Pagination'
import {WorkoutSummary} from '@data/models/WorkoutSummary'
import {httpGet} from '@service/http/httpUtil'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

import CrashUtility from '../../utility/CrashUtility'

const nullableNumber = io.union([io.number, io.null, io.undefined])

const BestSetResponse = io.type({
  weight: nullableNumber,
  addedWeight: nullableNumber,
  reps: nullableNumber,
  durationSeconds: nullableNumber
})

const ExerciseSummaryResponse = io.type({
  setsCompleted: io.number,
  loggingType: io.union([io.string, io.undefined]),
  bestSet: io.union([BestSetResponse, io.undefined]),
  exercise: io.type({
    name: io.string
  })
})

const WorkoutSummaryResponse = io.type({
  workoutDayId: io.string,
  day: io.string,
  totalWeight: io.number,
  totalDurationSeconds: io.union([io.number, io.undefined]),
  totalBodyweightReps: io.union([io.number, io.undefined]),
  exercises: io.array(ExerciseSummaryResponse)
})

const WorkoutSummariesApiResponse = io.type({
  summaries: io.array(WorkoutSummaryResponse),
  pagination: io.type({
    page: io.number,
    limit: io.number,
    total: io.number,
    totalPages: io.number
  })
})

export async function fetchWorkoutSummaries(page: number = 1): Promise<{
  summaries: WorkoutSummary[]
  pagination: Pagination
}> {
  try {
    const response = await httpGet(Endpoints.WorkoutSummaries + `?page=${page}&limit=15`, WorkoutSummariesApiResponse)

    const data = response?.data

    if (!data?.summaries) throw new Error('No workout summaries returned')

    return {
      // Older backend responses predate the duration/reps totals and the
      // per-exercise loggingType — default them so the UI can rely on them
      summaries: data.summaries.map(summary => ({
        ...summary,
        totalDurationSeconds: summary.totalDurationSeconds ?? 0,
        totalBodyweightReps: summary.totalBodyweightReps ?? 0,
        exercises: summary.exercises.map(exercise => ({
          ...exercise,
          loggingType: exercise.loggingType ?? 'WEIGHT_REPS'
        }))
      })),
      pagination: data.pagination
    }
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

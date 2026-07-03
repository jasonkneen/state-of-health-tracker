import {WorkoutDay} from '@data/models/WorkoutDay'
import {convertWorkoutDay} from '@queries/api/workouts/converter/convertWorkoutDay'
import {WorkoutDayResponse} from '@queries/api/workouts/decoder/WorkoutDayDecoder'
import {httpGet} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

const NullableWorkoutDayResponse = io.union([WorkoutDayResponse, io.null])

export async function fetchWorkoutForDay(isoDayStamp: string): Promise<WorkoutDay | null> {
  try {
    const response = await httpGet(`${Endpoints.Workout}${isoDayStamp}`, NullableWorkoutDayResponse)

    const data = response?.data

    if (!response) throw new Error('Error fetching workout for day')

    if (!data) return null

    return convertWorkoutDay(data)
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

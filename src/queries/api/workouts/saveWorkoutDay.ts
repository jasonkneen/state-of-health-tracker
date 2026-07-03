import {WorkoutDay} from '@data/models/WorkoutDay'
import {convertWorkoutDay} from '@queries/api/workouts/converter/convertWorkoutDay'
import {WorkoutDayResponse} from '@queries/api/workouts/decoder/WorkoutDayDecoder'
import {httpPost} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'

import Endpoints from '@constants/endpoints'

export async function saveWorkoutDay(workoutDay: WorkoutDay): Promise<WorkoutDay> {
  try {
    const response = await httpPost(Endpoints.Workout, WorkoutDayResponse, workoutDay)

    if (response?.status !== 201 || !response.data) {
      throw new Error(`Unexpected response: status=${response?.status}`)
    }

    const data = response.data

    const mappedWorkoutDay = convertWorkoutDay(data)

    mappedWorkoutDay.synced = true

    return mappedWorkoutDay
  } catch (error) {
    console.log('ERROR_SAVING', error)
    CrashUtility.recordError(error)
    throw error
  }
}

import {mapExerciseBodyPart, mapExerciseType, mapLoggingType} from '@data/converters/ExerciseConverter'
import {CreateExercisePayload, Exercise} from '@data/models/Exercise'
import {httpPost} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

const ExerciseResponse = io.type({
  id: io.string,
  name: io.string,
  exerciseType: io.string,
  exerciseBodyPart: io.string,
  loggingType: io.union([io.string, io.undefined])
})

export async function createExercise(payload: CreateExercisePayload): Promise<Exercise> {
  try {
    const response = await httpPost(Endpoints.Exercise, ExerciseResponse, payload)

    if (!response || !response.data) {
      throw new Error('Invalid response when creating exercise')
    }

    return {
      id: response.data.id,
      name: response.data.name,
      exerciseType: mapExerciseType(response.data.exerciseType),
      exerciseBodyPart: mapExerciseBodyPart(response.data.exerciseBodyPart),
      loggingType: mapLoggingType(response.data.loggingType ?? payload.loggingType ?? 'WEIGHT_REPS'),
      latestCompletedSets: []
    }
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

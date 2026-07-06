import {mapExerciseBodyPart, mapExerciseType, mapLoggingType} from '@data/converters/ExerciseConverter'
import {Exercise} from '@data/models/Exercise'
import {httpGet} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

const optionalNumber = io.union([io.number, io.undefined, io.null])

const LatestCompletedSet = io.type({
  id: io.string,
  reps: io.number,
  weight: io.number,
  setNumber: io.union([io.number, io.undefined, io.null]),
  completed: io.union([io.boolean, io.undefined, io.null]),
  completedAt: io.union([io.string, io.undefined, io.null]),
  addedWeight: optionalNumber,
  durationSeconds: optionalNumber,
  distanceMeters: optionalNumber,
  rpe: optionalNumber
})

const ExerciseResponse = io.type({
  id: io.string,
  name: io.string,
  exerciseType: io.string,
  exerciseBodyPart: io.string,
  loggingType: io.union([io.string, io.undefined]),
  totalCompletedSets: optionalNumber,
  latestCompletedSets: io.array(LatestCompletedSet)
})

const ExerciseArrayResponse = io.array(ExerciseResponse)

export async function fetchExercises(): Promise<Exercise[]> {
  try {
    const response = await httpGet(Endpoints.Exercises, ExerciseArrayResponse)

    const data = response?.data

    if (!response || !data) throw new Error('No exercises found')

    return data.map(
      (ex): Exercise => ({
        id: ex.id,
        name: ex.name,
        exerciseType: mapExerciseType(ex.exerciseType),
        exerciseBodyPart: mapExerciseBodyPart(ex.exerciseBodyPart),
        loggingType: mapLoggingType(ex.loggingType ?? 'WEIGHT_REPS'),
        // Older backend responses predate the total — the latest session's
        // set count is the closest available stand-in
        totalCompletedSets: ex.totalCompletedSets ?? ex.latestCompletedSets.length,
        latestCompletedSets: ex.latestCompletedSets.map(set => ({
          id: set.id,
          reps: set.reps,
          weight: set.weight,
          setNumber: set.setNumber ?? 0,
          completed: set.completed ?? false,
          completedAt: set.completedAt,
          addedWeight: set.addedWeight,
          durationSeconds: set.durationSeconds,
          distanceMeters: set.distanceMeters,
          rpe: set.rpe
        }))
      })
    )
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

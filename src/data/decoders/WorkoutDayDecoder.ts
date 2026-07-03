import * as io from 'io-ts'

const optionalNumber = io.union([io.number, io.null, io.undefined])

export const ExerciseSetResponse = io.type({
  id: io.string,
  reps: io.number,
  weight: io.number,
  completed: io.boolean,
  addedWeight: optionalNumber,
  durationSeconds: optionalNumber,
  distanceMeters: optionalNumber,
  rpe: optionalNumber,
  isWarmup: io.union([io.boolean, io.undefined])
})

export const ExerciseResponse = io.type({
  id: io.string,
  name: io.string,
  exerciseType: io.string,
  exerciseBodyPart: io.string,
  loggingType: io.union([io.string, io.undefined])
})

export const DailyExerciseResponse = io.type({
  dailyExerciseId: io.string,
  exercise: ExerciseResponse,
  order: io.union([io.number, io.undefined]),
  sets: io.array(ExerciseSetResponse)
})

export const WorkoutDayResponse = io.type({
  id: io.string,
  date: io.string,
  updatedAt: io.number,
  userId: io.string,
  dailyExercises: io.array(DailyExerciseResponse)
})

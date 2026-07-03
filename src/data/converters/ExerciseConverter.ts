import {ExerciseBodyPartEnum, ExerciseTypeEnum, LoggingTypeEnum} from '@data/models/Exercise'

export const mapExerciseType = (type: string): ExerciseTypeEnum => {
  switch (type.toLowerCase()) {
    case 'barbell':
      return ExerciseTypeEnum.BARBELL
    case 'dumbbell':
      return ExerciseTypeEnum.DUMBBELL
    case 'bodyweight':
      return ExerciseTypeEnum.BODYWEIGHT
    case 'cable':
      return ExerciseTypeEnum.CABLE
    case 'machine':
      return ExerciseTypeEnum.MACHINE
    case 'weighted':
      return ExerciseTypeEnum.WEIGHTED
    case 'kettlebell':
      return ExerciseTypeEnum.KETTLEBELL
    case 'timed':
      return ExerciseTypeEnum.TIMED
    case 'weighted timed':
      return ExerciseTypeEnum.WEIGHTED_TIME
    default:
      return ExerciseTypeEnum.OTHER
  }
}

export const mapExerciseBodyPart = (muscleGroup: string): ExerciseBodyPartEnum => {
  switch (muscleGroup.toLowerCase()) {
    case 'chest':
      return ExerciseBodyPartEnum.CHEST
    case 'back':
      return ExerciseBodyPartEnum.BACK
    case 'shoulders':
      return ExerciseBodyPartEnum.SHOULDERS
    case 'traps':
      return ExerciseBodyPartEnum.TRAPS
    case 'triceps':
      return ExerciseBodyPartEnum.TRICEPS
    case 'biceps':
      return ExerciseBodyPartEnum.BICEPS
    case 'core':
      return ExerciseBodyPartEnum.CORE
    case 'legs':
      return ExerciseBodyPartEnum.LEGS
    case 'calves':
      return ExerciseBodyPartEnum.CALVES
    case 'full body':
      return ExerciseBodyPartEnum.FULL_BODY
    case 'cardio':
      return ExerciseBodyPartEnum.CARDIO
    default:
      return ExerciseBodyPartEnum.OTHER
  }
}

// Smart default for exercise creation: derives a logging type from the
// equipment type the user already picks, so bodyweight/timed exercises work
// Logging is always inferred from the exercise type — the user picks one thing
// and the set inputs follow. WEIGHTED_BODYWEIGHT, TIME_REPS, and DISTANCE_TIME
// have no producing type yet; they stay in the enum for stored data.
export const deriveLoggingTypeFromExerciseType = (exerciseType: ExerciseTypeEnum): LoggingTypeEnum => {
  switch (exerciseType) {
    case ExerciseTypeEnum.BODYWEIGHT:
      return LoggingTypeEnum.BODYWEIGHT_REPS
    case ExerciseTypeEnum.TIMED:
      return LoggingTypeEnum.TIME_ONLY
    case ExerciseTypeEnum.WEIGHTED_TIME:
      return LoggingTypeEnum.WEIGHT_TIME
    default:
      return LoggingTypeEnum.WEIGHT_REPS
  }
}

export const mapLoggingType = (type: string): LoggingTypeEnum => {
  switch (type) {
    case 'BODYWEIGHT_REPS':
      return LoggingTypeEnum.BODYWEIGHT_REPS
    case 'WEIGHTED_BODYWEIGHT':
      return LoggingTypeEnum.WEIGHTED_BODYWEIGHT
    case 'TIME_ONLY':
      return LoggingTypeEnum.TIME_ONLY
    case 'TIME_REPS':
      return LoggingTypeEnum.TIME_REPS
    case 'WEIGHT_TIME':
      return LoggingTypeEnum.WEIGHT_TIME
    case 'DISTANCE_TIME':
      return LoggingTypeEnum.DISTANCE_TIME
    default:
      return LoggingTypeEnum.WEIGHT_REPS
  }
}

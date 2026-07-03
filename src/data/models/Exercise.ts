import {ExerciseSet} from './ExerciseSet'

export enum ExerciseTypeEnum {
  BARBELL = 'Barbell',
  DUMBBELL = 'Dumbbell',
  BODYWEIGHT = 'Bodyweight',
  CABLE = 'Cable',
  MACHINE = 'Machine',
  WEIGHTED = 'Weighted',
  KETTLEBELL = 'Kettlebell',
  TIMED = 'Timed',
  WEIGHTED_TIME = 'Weighted Timed',
  OTHER = 'Other'
}

export enum ExerciseBodyPartEnum {
  CHEST = 'Chest',
  BACK = 'Back',
  SHOULDERS = 'Shoulders',
  TRAPS = 'Traps',
  TRICEPS = 'Triceps',
  BICEPS = 'Biceps',
  CORE = 'Core',
  LEGS = 'Legs',
  CALVES = 'Calves',
  FULL_BODY = 'Full Body',
  CARDIO = 'Cardio',
  OTHER = 'Other'
}

// How a set for this exercise gets logged/entered — distinct from
// ExerciseTypeEnum (equipment) and ExerciseBodyPartEnum (muscle group).
export enum LoggingTypeEnum {
  WEIGHT_REPS = 'WEIGHT_REPS',
  BODYWEIGHT_REPS = 'BODYWEIGHT_REPS',
  WEIGHTED_BODYWEIGHT = 'WEIGHTED_BODYWEIGHT',
  TIME_ONLY = 'TIME_ONLY',
  TIME_REPS = 'TIME_REPS',
  WEIGHT_TIME = 'WEIGHT_TIME',
  DISTANCE_TIME = 'DISTANCE_TIME'
}

export interface CreateExercisePayload {
  name: string
  exerciseType: string
  exerciseBodyPart: string
  loggingType?: string
}

export interface Exercise {
  id: string
  name: string
  exerciseType: ExerciseTypeEnum
  exerciseBodyPart: ExerciseBodyPartEnum
  loggingType: LoggingTypeEnum
  totalCompletedSets: number
  latestCompletedSets: ExerciseSet[]
}

export function isExerciseObject(object: any): object is Exercise {
  return (
    'id' in object &&
    'name' in object &&
    'exerciseType' in object &&
    'exerciseBodyPart' in object &&
    'latestCompletedSets' in object
  )
}

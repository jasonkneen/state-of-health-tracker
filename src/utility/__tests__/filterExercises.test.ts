import {Exercise, ExerciseBodyPartEnum, ExerciseTypeEnum, LoggingTypeEnum} from '@data/models/Exercise'

import {filterExercises} from '../filterExercises'

const buildExercise = (
  name: string,
  exerciseType: ExerciseTypeEnum,
  exerciseBodyPart: ExerciseBodyPartEnum
): Exercise => ({
  id: name,
  name,
  exerciseType,
  exerciseBodyPart,
  loggingType: LoggingTypeEnum.WEIGHT_REPS,
  totalCompletedSets: 0,
  latestCompletedSets: []
})

const exercises: Exercise[] = [
  buildExercise('Bench Press', ExerciseTypeEnum.BARBELL, ExerciseBodyPartEnum.CHEST),
  buildExercise('Squat', ExerciseTypeEnum.BARBELL, ExerciseBodyPartEnum.LEGS),
  buildExercise('Lateral Raise', ExerciseTypeEnum.DUMBBELL, ExerciseBodyPartEnum.SHOULDERS)
]

describe('filterExercises', () => {
  describe('empty filter', () => {
    it('returns the list unchanged for an empty string', () => {
      expect(filterExercises(exercises, '')).toEqual(exercises)
    })

    it('returns an empty list unchanged', () => {
      expect(filterExercises([], 'bench')).toEqual([])
    })
  })

  describe('matching', () => {
    it('matches by name, case-insensitively', () => {
      expect(filterExercises(exercises, 'bench')).toEqual([exercises[0]])
    })

    it('matches by exercise type', () => {
      expect(filterExercises(exercises, 'dumbbell')).toEqual([exercises[2]])
    })

    it('matches by body part', () => {
      expect(filterExercises(exercises, 'legs')).toEqual([exercises[1]])
    })

    it('returns multiple matches', () => {
      expect(filterExercises(exercises, 'barbell')).toEqual([exercises[0], exercises[1]])
    })

    it('returns an empty list when nothing matches', () => {
      expect(filterExercises(exercises, 'deadlift')).toEqual([])
    })
  })
})

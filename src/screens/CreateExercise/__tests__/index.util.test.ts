import {ExerciseBodyPartEnum, ExerciseTypeEnum} from '@data/models/Exercise'

import {bodyPartValues, combineExerciseNameType, exerciseTypeValues} from '../index.util'

describe('combineExerciseNameType', () => {
  it('appends the exercise type in parentheses', () => {
    expect(combineExerciseNameType('Bench Press', ExerciseTypeEnum.BARBELL)).toBe('Bench Press (Barbell)')
  })

  it('does not append the type when it is Other', () => {
    expect(combineExerciseNameType('Bench Press', ExerciseTypeEnum.OTHER)).toBe('Bench Press')
  })

  it('treats a plain "Other" string the same as the enum value', () => {
    expect(combineExerciseNameType('Bench Press', 'Other')).toBe('Bench Press')
  })

  it('appends custom string types', () => {
    expect(combineExerciseNameType('Curl', 'Resistance Band')).toBe('Curl (Resistance Band)')
  })

  it('appends the type even for an empty name', () => {
    expect(combineExerciseNameType('', ExerciseTypeEnum.DUMBBELL)).toBe(' (Dumbbell)')
  })
})

describe('exerciseTypeValues', () => {
  it('contains one entry per exercise type', () => {
    expect(exerciseTypeValues.map(item => item.value)).toEqual(Object.values(ExerciseTypeEnum))
  })

  it('uses the same string for label and value', () => {
    exerciseTypeValues.forEach(item => {
      expect(item.label).toBe(item.value)
    })
  })
})

describe('bodyPartValues', () => {
  it('contains one entry per body part', () => {
    expect(bodyPartValues.map(item => item.value)).toEqual(Object.values(ExerciseBodyPartEnum))
  })

  it('uses the same string for label and value', () => {
    bodyPartValues.forEach(item => {
      expect(item.label).toBe(item.value)
    })
  })
})

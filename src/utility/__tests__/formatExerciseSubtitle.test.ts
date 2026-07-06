import {ExerciseBodyPartEnum, ExerciseTypeEnum} from '@data/models/Exercise'

import {formatExerciseSubtitle} from '../formatExerciseSubtitle'

describe('formatExerciseSubtitle', () => {
  it('joins type and body part with a separator', () => {
    expect(formatExerciseSubtitle(ExerciseTypeEnum.BARBELL, ExerciseBodyPartEnum.CHEST)).toBe('Barbell · Chest')
  })

  it('omits the type when it is Other', () => {
    expect(formatExerciseSubtitle(ExerciseTypeEnum.OTHER, ExerciseBodyPartEnum.LEGS)).toBe('Legs')
  })

  it('omits the body part when it is Other', () => {
    expect(formatExerciseSubtitle(ExerciseTypeEnum.DUMBBELL, ExerciseBodyPartEnum.OTHER)).toBe('Dumbbell')
  })

  it('returns undefined when both are Other', () => {
    expect(formatExerciseSubtitle(ExerciseTypeEnum.OTHER, ExerciseBodyPartEnum.OTHER)).toBeUndefined()
  })

  it('treats plain "Other" strings the same as the enum values', () => {
    expect(formatExerciseSubtitle('Other', 'Other')).toBeUndefined()
  })

  it('passes through custom string values', () => {
    expect(formatExerciseSubtitle('Resistance Band', 'Forearms')).toBe('Resistance Band · Forearms')
  })

  it('omits empty strings', () => {
    expect(formatExerciseSubtitle('', ExerciseBodyPartEnum.BACK)).toBe('Back')
  })

  it('returns undefined when both are empty strings', () => {
    expect(formatExerciseSubtitle('', '')).toBeUndefined()
  })
})

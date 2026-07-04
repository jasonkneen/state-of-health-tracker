import {LoggingTypeEnum} from '@data/models/Exercise'

import {bestSetLabel} from '../index.util'

describe('bestSetLabel', () => {
  const weightLabel = 'lbs'

  it('formats weight and reps', () => {
    expect(bestSetLabel(LoggingTypeEnum.WEIGHT_REPS, weightLabel, {weight: 225, reps: 5})).toBe('225 lbs x 5')
  })

  it('formats bodyweight reps', () => {
    expect(bestSetLabel(LoggingTypeEnum.BODYWEIGHT_REPS, weightLabel, {reps: 12})).toBe('12 reps')
  })

  it('formats weighted bodyweight with added weight', () => {
    expect(bestSetLabel(LoggingTypeEnum.WEIGHTED_BODYWEIGHT, weightLabel, {addedWeight: 45, reps: 8})).toBe(
      '+45 lbs x 8'
    )
  })

  it('falls back to plain reps for weighted bodyweight without added weight', () => {
    expect(bestSetLabel(LoggingTypeEnum.WEIGHTED_BODYWEIGHT, weightLabel, {reps: 8})).toBe('8 reps')
  })

  it('formats time-only as a duration', () => {
    expect(bestSetLabel(LoggingTypeEnum.TIME_ONLY, weightLabel, {durationSeconds: 90})).toBe('1:30')
  })

  it('formats weight and time', () => {
    expect(bestSetLabel(LoggingTypeEnum.WEIGHT_TIME, weightLabel, {weight: 45, durationSeconds: 60})).toBe(
      '45 lbs · 1:00'
    )
  })

  it('formats time and reps', () => {
    expect(bestSetLabel(LoggingTypeEnum.TIME_REPS, weightLabel, {durationSeconds: 30, reps: 3})).toBe('0:30 x 3')
  })

  it('defaults to weight x reps for unknown logging types', () => {
    expect(bestSetLabel(LoggingTypeEnum.DISTANCE_TIME, weightLabel, {weight: 100, reps: 10})).toBe('100 lbs x 10')
  })

  it('uses the given weight unit label', () => {
    expect(bestSetLabel(LoggingTypeEnum.WEIGHT_REPS, 'kg', {weight: 100, reps: 5})).toBe('100 kg x 5')
  })

  it('zero-fills when there is no best set', () => {
    expect(bestSetLabel(LoggingTypeEnum.WEIGHT_REPS, weightLabel, undefined)).toBe('0 lbs x 0')
  })
})

import {LoggingTypeEnum} from '@data/models/Exercise'

import {bestSetLabel} from '../index.util'

describe('bestSetLabel', () => {
  it('formats weight and reps', () => {
    expect(bestSetLabel(LoggingTypeEnum.WEIGHT_REPS, {weight: 225, reps: 5})).toBe('225 lbs x 5')
  })

  it('formats bodyweight reps', () => {
    expect(bestSetLabel(LoggingTypeEnum.BODYWEIGHT_REPS, {reps: 12})).toBe('12 reps')
  })

  it('formats weighted bodyweight with added weight', () => {
    expect(bestSetLabel(LoggingTypeEnum.WEIGHTED_BODYWEIGHT, {addedWeight: 45, reps: 8})).toBe('+45 lbs x 8')
  })

  it('falls back to plain reps for weighted bodyweight without added weight', () => {
    expect(bestSetLabel(LoggingTypeEnum.WEIGHTED_BODYWEIGHT, {reps: 8})).toBe('8 reps')
  })

  it('formats time-only as a duration', () => {
    expect(bestSetLabel(LoggingTypeEnum.TIME_ONLY, {durationSeconds: 90})).toBe('1:30')
  })

  it('formats weight and time', () => {
    expect(bestSetLabel(LoggingTypeEnum.WEIGHT_TIME, {weight: 45, durationSeconds: 60})).toBe('45 lbs · 1:00')
  })

  it('formats time and reps', () => {
    expect(bestSetLabel(LoggingTypeEnum.TIME_REPS, {durationSeconds: 30, reps: 3})).toBe('0:30 x 3')
  })

  it('defaults to weight x reps for unknown logging types', () => {
    expect(bestSetLabel(LoggingTypeEnum.DISTANCE_TIME, {weight: 100, reps: 10})).toBe('100 lbs x 10')
  })

  it('zero-fills when there is no best set', () => {
    expect(bestSetLabel(LoggingTypeEnum.WEIGHT_REPS, undefined)).toBe('0 lbs x 0')
  })
})

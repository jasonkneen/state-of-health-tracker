import {LoggingTypeEnum} from '@data/models/Exercise'
import {ExerciseSet} from '@data/models/ExerciseSet'
import {METERS_PER_MILE} from '@utility/RunUtility'

import {ADDED_LBS_LABEL, DISTANCE_MI_LABEL, DURATION_SEC_LABEL, LBS_LABEL, REPS_LABEL} from '@constants/strings'

import {
  emptyFieldTexts,
  formatSetFieldInputText,
  getSetFieldsForLoggingType,
  parseSetFieldText,
  setFieldToDisplayText
} from '../index.util'

const makeSet = (overrides: Partial<ExerciseSet> = {}): ExerciseSet => ({
  id: 'set-1',
  completed: false,
  ...overrides
})

describe('getSetFieldsForLoggingType', () => {
  it('returns required weight and reps for WEIGHT_REPS', () => {
    expect(getSetFieldsForLoggingType(LoggingTypeEnum.WEIGHT_REPS)).toEqual([
      {key: 'weight', label: LBS_LABEL, required: true},
      {key: 'reps', label: REPS_LABEL, required: true}
    ])
  })

  it('returns only required reps for BODYWEIGHT_REPS', () => {
    expect(getSetFieldsForLoggingType(LoggingTypeEnum.BODYWEIGHT_REPS)).toEqual([
      {key: 'reps', label: REPS_LABEL, required: true}
    ])
  })

  it('returns optional added weight and required reps for WEIGHTED_BODYWEIGHT', () => {
    expect(getSetFieldsForLoggingType(LoggingTypeEnum.WEIGHTED_BODYWEIGHT)).toEqual([
      {key: 'addedWeight', label: ADDED_LBS_LABEL, required: false},
      {key: 'reps', label: REPS_LABEL, required: true}
    ])
  })

  it('returns only required duration for TIME_ONLY', () => {
    expect(getSetFieldsForLoggingType(LoggingTypeEnum.TIME_ONLY)).toEqual([
      {key: 'durationSeconds', label: DURATION_SEC_LABEL, required: true}
    ])
  })

  it('returns required duration and reps for TIME_REPS', () => {
    expect(getSetFieldsForLoggingType(LoggingTypeEnum.TIME_REPS)).toEqual([
      {key: 'durationSeconds', label: DURATION_SEC_LABEL, required: true},
      {key: 'reps', label: REPS_LABEL, required: true}
    ])
  })

  it('returns required weight and duration for WEIGHT_TIME', () => {
    expect(getSetFieldsForLoggingType(LoggingTypeEnum.WEIGHT_TIME)).toEqual([
      {key: 'weight', label: LBS_LABEL, required: true},
      {key: 'durationSeconds', label: DURATION_SEC_LABEL, required: true}
    ])
  })

  it('returns required distance and duration for DISTANCE_TIME', () => {
    expect(getSetFieldsForLoggingType(LoggingTypeEnum.DISTANCE_TIME)).toEqual([
      {key: 'distanceMeters', label: DISTANCE_MI_LABEL, required: true},
      {key: 'durationSeconds', label: DURATION_SEC_LABEL, required: true}
    ])
  })

  it('falls back to weight and reps for an unknown logging type', () => {
    expect(getSetFieldsForLoggingType('SOMETHING_ELSE' as LoggingTypeEnum)).toEqual([
      {key: 'weight', label: LBS_LABEL, required: true},
      {key: 'reps', label: REPS_LABEL, required: true}
    ])
  })
})

describe('setFieldToDisplayText', () => {
  it('returns undefined for null', () => {
    expect(setFieldToDisplayText('weight', null)).toBeUndefined()
  })

  it('returns undefined for undefined', () => {
    expect(setFieldToDisplayText('reps', undefined)).toBeUndefined()
  })

  it('formats durationSeconds as m:ss', () => {
    expect(setFieldToDisplayText('durationSeconds', 90)).toBe('1:30')
  })

  it('pads duration seconds under ten', () => {
    expect(setFieldToDisplayText('durationSeconds', 65)).toBe('1:05')
  })

  it('formats distanceMeters as miles with two decimals', () => {
    expect(setFieldToDisplayText('distanceMeters', METERS_PER_MILE)).toBe('1.00')
  })

  it('rounds fractional miles to two decimals', () => {
    expect(setFieldToDisplayText('distanceMeters', 5000)).toBe('3.11')
  })

  it('stringifies weight as-is', () => {
    expect(setFieldToDisplayText('weight', 135)).toBe('135')
  })

  it('stringifies reps as-is', () => {
    expect(setFieldToDisplayText('reps', 8)).toBe('8')
  })

  it('displays a zero value', () => {
    expect(setFieldToDisplayText('weight', 0)).toBe('0')
  })
})

describe('formatSetFieldInputText', () => {
  it('returns non-duration text unchanged', () => {
    expect(formatSetFieldInputText('weight', '135')).toBe('135')
  })

  it('masks a single digit as seconds', () => {
    expect(formatSetFieldInputText('durationSeconds', '1')).toBe('0:01')
  })

  it('masks two digits as seconds', () => {
    expect(formatSetFieldInputText('durationSeconds', '13')).toBe('0:13')
  })

  it('shifts a third digit into the minutes place', () => {
    expect(formatSetFieldInputText('durationSeconds', '130')).toBe('1:30')
  })

  it('keeps shifting as the user types through an existing mask', () => {
    expect(formatSetFieldInputText('durationSeconds', '1:305')).toBe('13:05')
  })

  it('strips leading zeros so backspace can empty the field', () => {
    expect(formatSetFieldInputText('durationSeconds', '0013')).toBe('0:13')
  })

  it('renders a lone zero as empty', () => {
    expect(formatSetFieldInputText('durationSeconds', '0')).toBe('')
  })

  it('returns empty for an empty string', () => {
    expect(formatSetFieldInputText('durationSeconds', '')).toBe('')
  })

  it('caps the buffer at four digits', () => {
    expect(formatSetFieldInputText('durationSeconds', '12345')).toBe('12:34')
  })
})

describe('parseSetFieldText', () => {
  it('returns undefined for an empty string on any field', () => {
    expect(parseSetFieldText('weight', '')).toBeUndefined()
    expect(parseSetFieldText('durationSeconds', '')).toBeUndefined()
    expect(parseSetFieldText('distanceMeters', '')).toBeUndefined()
  })

  it('parses one or two bare digits as seconds', () => {
    expect(parseSetFieldText('durationSeconds', '5')).toBe(5)
    expect(parseSetFieldText('durationSeconds', '45')).toBe(45)
  })

  it('parses a masked duration into total seconds', () => {
    expect(parseSetFieldText('durationSeconds', '1:30')).toBe(90)
  })

  it('normalizes overflow seconds, so 1:90 becomes 150', () => {
    expect(parseSetFieldText('durationSeconds', '1:90')).toBe(150)
  })

  it('returns undefined for a duration with no digits', () => {
    expect(parseSetFieldText('durationSeconds', 'abc')).toBeUndefined()
  })

  it('converts distance miles to meters', () => {
    expect(parseSetFieldText('distanceMeters', '2')).toBeCloseTo(2 * METERS_PER_MILE, 5)
  })

  it('parses fractional miles', () => {
    expect(parseSetFieldText('distanceMeters', '1.5')).toBeCloseTo(1.5 * METERS_PER_MILE, 5)
  })

  it('parses weight as an integer', () => {
    expect(parseSetFieldText('weight', '135')).toBe(135)
  })

  it('truncates decimals on integer fields', () => {
    expect(parseSetFieldText('reps', '12.9')).toBe(12)
  })

  it('returns undefined for non-numeric text', () => {
    expect(parseSetFieldText('weight', 'abc')).toBeUndefined()
    expect(parseSetFieldText('distanceMeters', 'abc')).toBeUndefined()
  })
})

describe('emptyFieldTexts', () => {
  it('returns empty strings for a fresh set', () => {
    expect(emptyFieldTexts(makeSet())).toEqual({
      weight: '',
      reps: '',
      addedWeight: '',
      durationSeconds: '',
      distanceMeters: ''
    })
  })

  it('formats every populated field for display', () => {
    const set = makeSet({
      weight: 135,
      reps: 8,
      addedWeight: 25,
      durationSeconds: 90,
      distanceMeters: METERS_PER_MILE
    })

    expect(emptyFieldTexts(set)).toEqual({
      weight: '135',
      reps: '8',
      addedWeight: '25',
      durationSeconds: '1:30',
      distanceMeters: '1.00'
    })
  })

  it('maps null fields to empty strings', () => {
    const set = makeSet({weight: 135, addedWeight: null, durationSeconds: null, distanceMeters: null})

    const texts = emptyFieldTexts(set)

    expect(texts.weight).toBe('135')
    expect(texts.addedWeight).toBe('')
    expect(texts.durationSeconds).toBe('')
    expect(texts.distanceMeters).toBe('')
  })
})

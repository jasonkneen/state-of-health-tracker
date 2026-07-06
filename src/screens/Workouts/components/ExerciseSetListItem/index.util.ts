import {LoggingTypeEnum} from '@data/models/Exercise'
import {ExerciseSet} from '@data/models/ExerciseSet'
import {formatSecondsAsDuration} from '@utility/formatSecondsAsDuration'
import {METERS_PER_MILE} from '@utility/RunUtility'

import {DISTANCE_MI_LABEL, DURATION_SEC_LABEL, REPS_LABEL} from '@constants/strings'

export type SetFieldKey = 'weight' | 'reps' | 'addedWeight' | 'durationSeconds' | 'distanceMeters'

export interface SetFieldConfig {
  key: SetFieldKey
  label: string
  required: boolean
}

// Which inputs a set shows, and which of them block completing the set —
// driven by the exercise's loggingType, not by exerciseType (equipment).
// weightLabel is the user's display unit; it never affects the stored values.
export const getSetFieldsForLoggingType = (loggingType: LoggingTypeEnum, weightLabel: string): SetFieldConfig[] => {
  switch (loggingType) {
    case LoggingTypeEnum.BODYWEIGHT_REPS:
      return [{key: 'reps', label: REPS_LABEL, required: true}]
    case LoggingTypeEnum.WEIGHTED_BODYWEIGHT:
      return [
        {key: 'addedWeight', label: `+${weightLabel}`, required: false},
        {key: 'reps', label: REPS_LABEL, required: true}
      ]
    case LoggingTypeEnum.TIME_ONLY:
      return [{key: 'durationSeconds', label: DURATION_SEC_LABEL, required: true}]
    case LoggingTypeEnum.TIME_REPS:
      return [
        {key: 'durationSeconds', label: DURATION_SEC_LABEL, required: true},
        {key: 'reps', label: REPS_LABEL, required: true}
      ]
    case LoggingTypeEnum.WEIGHT_TIME:
      return [
        {key: 'weight', label: weightLabel, required: true},
        {key: 'durationSeconds', label: DURATION_SEC_LABEL, required: true}
      ]
    case LoggingTypeEnum.DISTANCE_TIME:
      return [
        {key: 'distanceMeters', label: DISTANCE_MI_LABEL, required: true},
        {key: 'durationSeconds', label: DURATION_SEC_LABEL, required: true}
      ]
    case LoggingTypeEnum.WEIGHT_REPS:
    default:
      return [
        {key: 'weight', label: weightLabel, required: true},
        {key: 'reps', label: REPS_LABEL, required: true}
      ]
  }
}

// Duration is entered/displayed as m:ss but stored/synced as raw seconds.
// distanceMeters is stored/synced in meters but entered/displayed in miles,
// matching the rest of the app's units (RunUtility). Every other field is 1:1.
export const setFieldToDisplayText = (key: SetFieldKey, value: number | null | undefined): string | undefined => {
  if (value === null || value === undefined) return undefined

  if (key === 'durationSeconds') return formatSecondsAsDuration(value)

  return key === 'distanceMeters' ? (value / METERS_PER_MILE).toFixed(2) : value.toString()
}

// Live timer-style mask for the duration input: the colon is always visible and
// digits shift in from the right — typing 1, 3, 0 renders 0:01 -> 0:13 -> 1:30.
// Leading zeros are stripped from the buffer so backspace can empty the field.
export const formatSetFieldInputText = (key: SetFieldKey, text: string): string => {
  if (key !== 'durationSeconds') return text

  const digits = text.replace(/\D/g, '').replace(/^0+/, '').slice(0, 4)

  if (digits === '') return ''

  const padded = digits.padStart(3, '0')

  return `${padded.slice(0, -2)}:${padded.slice(-2)}`
}

export const parseSetFieldText = (key: SetFieldKey, text: string): number | undefined => {
  if (text === '') return undefined

  if (key === 'durationSeconds') {
    const digits = text.replace(/\D/g, '')

    if (digits === '') return undefined

    // Bare digits are seconds; with more than two digits the tail is seconds
    // and the head is minutes, matching the input mask. 1:90 normalizes to 150.
    if (digits.length <= 2) return parseInt(digits, 10)

    return parseInt(digits.slice(0, -2) || '0', 10) * 60 + parseInt(digits.slice(-2), 10)
  }

  const parsed = key === 'distanceMeters' ? parseFloat(text) : parseInt(text, 10)

  if (Number.isNaN(parsed)) return undefined

  return key === 'distanceMeters' ? parsed * METERS_PER_MILE : parsed
}

export const emptyFieldTexts = (set: ExerciseSet): Record<SetFieldKey, string> => ({
  weight: setFieldToDisplayText('weight', set.weight) ?? '',
  reps: setFieldToDisplayText('reps', set.reps) ?? '',
  addedWeight: setFieldToDisplayText('addedWeight', set.addedWeight) ?? '',
  durationSeconds: setFieldToDisplayText('durationSeconds', set.durationSeconds) ?? '',
  distanceMeters: setFieldToDisplayText('distanceMeters', set.distanceMeters) ?? ''
})

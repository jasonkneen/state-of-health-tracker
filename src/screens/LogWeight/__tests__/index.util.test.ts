import {LOG_WEIGHT_TODAY_LABEL, LOG_WEIGHT_YESTERDAY_LABEL} from '@constants/strings'

import {buildLoggedAtISO, canStepForward, formatLogDateLabel, parseWeightInput} from '../index.util'

describe('parseWeightInput', () => {
  it('parses decimal weights and rounds to one decimal', () => {
    expect(parseWeightInput('180')).toBe(180)
    expect(parseWeightInput('180.4')).toBe(180.4)
    expect(parseWeightInput('180.46')).toBe(180.5)
    expect(parseWeightInput('.5')).toBe(0.5)
  })

  it('accepts a comma as the decimal separator', () => {
    expect(parseWeightInput('180,4')).toBe(180.4)
  })

  it('rejects empty, non-numeric, zero and out-of-range input', () => {
    expect(parseWeightInput('')).toBeNull()
    expect(parseWeightInput('.')).toBeNull()
    expect(parseWeightInput('abc')).toBeNull()
    expect(parseWeightInput('12a')).toBeNull()
    expect(parseWeightInput('0')).toBeNull()
    expect(parseWeightInput('1000')).toBeNull()
  })
})

describe('formatLogDateLabel', () => {
  const now = new Date(2026, 6, 3, 12, 0, 0)

  it('labels the current day as Today and the day before as Yesterday', () => {
    expect(formatLogDateLabel(new Date(2026, 6, 3), now)).toBe(LOG_WEIGHT_TODAY_LABEL)
    expect(formatLogDateLabel(new Date(2026, 6, 2), now)).toBe(LOG_WEIGHT_YESTERDAY_LABEL)
  })

  it('formats older days as a short weekday date', () => {
    expect(formatLogDateLabel(new Date(2026, 5, 24), now)).toBe('Wed, Jun 24')
  })
})

describe('canStepForward', () => {
  const now = new Date(2026, 6, 3, 12, 0, 0)

  it('allows stepping forward only for past days', () => {
    expect(canStepForward(new Date(2026, 6, 2), now)).toBe(true)
    expect(canStepForward(new Date(2026, 6, 3, 9, 0, 0), now)).toBe(false)
  })
})

describe('buildLoggedAtISO', () => {
  it('stamps the chosen day with the representative hour for the period', () => {
    const date = new Date(2026, 6, 2, 23, 45, 12)

    const morning = new Date(buildLoggedAtISO(date, 'morning'))
    const evening = new Date(buildLoggedAtISO(date, 'evening'))

    expect(morning.getFullYear()).toBe(2026)
    expect(morning.getMonth()).toBe(6)
    expect(morning.getDate()).toBe(2)
    expect(morning.getHours()).toBe(8)
    expect(evening.getHours()).toBe(20)
  })
})

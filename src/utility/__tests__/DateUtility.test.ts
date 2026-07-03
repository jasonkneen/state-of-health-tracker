import {isMonday} from 'date-fns'

import {
  compareIsoDateStrings,
  formatDate,
  formatDateToMonthDay,
  formatDateToMonthDayName,
  formatDateUTC,
  formatDayMonthDay,
  getCurrentDate,
  getCurrentDateISO,
  getLast7Mondays,
  ONE_DAY_MS
} from '../DateUtility'

describe('ONE_DAY_MS', () => {
  it('equals the number of milliseconds in a day', () => {
    expect(ONE_DAY_MS).toBe(24 * 60 * 60 * 1000)
  })
})

describe('getCurrentDate', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-03T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('formats the current date as MMMM dd, yyyy', () => {
    expect(getCurrentDate()).toBe('July 03, 2026')
  })
})

describe('getCurrentDateISO', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-03T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('formats the current date as yyyy-MM-dd', () => {
    expect(getCurrentDateISO()).toBe('2026-07-03')
  })
})

describe('formatDate', () => {
  it('formats a timestamp as MMMM dd, yyyy', () => {
    expect(formatDate(new Date(2026, 0, 15).getTime())).toBe('January 15, 2026')
  })

  it('pads single-digit days', () => {
    expect(formatDate(new Date(2026, 5, 1).getTime())).toBe('June 01, 2026')
  })
})

describe('formatDateUTC', () => {
  it('formats the date portion of an ISO datetime string', () => {
    expect(formatDateUTC('2026-07-03T23:59:59.000Z')).toBe('July 03, 2026')
  })

  it('formats a date-only ISO string', () => {
    expect(formatDateUTC('2025-12-25')).toBe('December 25, 2025')
  })

  it('shows the ISO calendar day regardless of the device timezone', () => {
    // Regression: building the date at local midnight shifted the display to
    // the previous day on UTC+ devices
    expect(formatDateUTC('2026-01-01T00:00:00.000Z')).toBe('January 01, 2026')
  })
})

describe('compareIsoDateStrings', () => {
  it('returns true for the same day with different times', () => {
    expect(compareIsoDateStrings('2026-07-03T01:00:00.000Z', '2026-07-03T23:00:00.000Z')).toBe(true)
  })

  it('returns true for identical date-only strings', () => {
    expect(compareIsoDateStrings('2026-07-03', '2026-07-03')).toBe(true)
  })

  it('returns false for different days', () => {
    expect(compareIsoDateStrings('2026-07-03', '2026-07-04')).toBe(false)
  })

  it('returns false for the same day in different months', () => {
    expect(compareIsoDateStrings('2026-06-03', '2026-07-03')).toBe(false)
  })

  it('returns false for the same day in different years', () => {
    expect(compareIsoDateStrings('2025-07-03', '2026-07-03')).toBe(false)
  })

  it('returns false when an argument is not a string', () => {
    expect(compareIsoDateStrings(undefined as unknown as string, '2026-07-03')).toBe(false)
  })

  it('returns false for empty strings against a real date', () => {
    expect(compareIsoDateStrings('', '2026-07-03')).toBe(false)
  })
})

describe('formatDateToMonthDay', () => {
  it('formats a timestamp as M/d without padding', () => {
    expect(formatDateToMonthDay(new Date(2026, 6, 3).getTime())).toBe('7/3')
  })

  it('formats a local datetime string', () => {
    expect(formatDateToMonthDay('2026-12-25T12:00:00')).toBe('12/25')
  })
})

describe('formatDateToMonthDayName', () => {
  it('formats a timestamp as an abbreviated month and day', () => {
    expect(formatDateToMonthDayName(new Date(2026, 6, 3).getTime())).toBe('Jul 3')
  })

  it('formats a local datetime string', () => {
    expect(formatDateToMonthDayName('2026-12-25T12:00:00')).toBe('Dec 25')
  })
})

describe('getLast7Mondays', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-03T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns 7 timestamps', () => {
    expect(getLast7Mondays()).toHaveLength(7)
  })

  it('returns only Mondays', () => {
    getLast7Mondays().forEach(timestamp => {
      expect(isMonday(timestamp)).toBe(true)
    })
  })

  it('ends with the most recent Monday', () => {
    const mondays = getLast7Mondays()

    // 2026-07-03 is a Friday, so the most recent Monday is 4 days earlier
    expect(mondays[6]).toBe(Date.now() - 4 * ONE_DAY_MS)
  })

  it('returns Mondays in ascending order spaced one week apart', () => {
    const mondays = getLast7Mondays()

    for (let i = 1; i < mondays.length; i++) {
      expect(mondays[i] - mondays[i - 1]).toBe(7 * ONE_DAY_MS)
    }
  })

  it('returns the current timestamp last when today is a Monday', () => {
    jest.setSystemTime(new Date(2026, 5, 29, 12)) // Monday June 29, 2026

    const mondays = getLast7Mondays()

    expect(mondays[6]).toBe(Date.now())
  })
})

describe('formatDayMonthDay', () => {
  it('formats a timestamp with weekday, month and ordinal day', () => {
    expect(formatDayMonthDay(new Date(2026, 6, 3, 12).getTime())).toBe('Friday, July 3rd')
  })

  it('parses the MMMM dd, yyyy session-date format', () => {
    expect(formatDayMonthDay('July 03, 2026')).toBe('Friday, July 3rd')
  })

  it('falls back to native date parsing for ISO strings', () => {
    expect(formatDayMonthDay('2026-07-03T12:00:00')).toBe('Friday, July 3rd')
  })

  it('returns an empty string for an unparseable string', () => {
    expect(formatDayMonthDay('not a date')).toBe('')
  })

  it('returns an empty string for an empty string', () => {
    expect(formatDayMonthDay('')).toBe('')
  })
})

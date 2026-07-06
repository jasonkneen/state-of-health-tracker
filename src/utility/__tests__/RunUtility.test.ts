import {Run} from '@data/models/Run'

import {ONE_DAY_MS} from '../DateUtility'
import {
  daysAgo,
  formatDistanceMiles,
  formatElapsedTime,
  formatPace,
  formatPaceFromSecPerKm,
  formatRunDuration,
  formatSpeedMph,
  getMilesThisMonth,
  getPaceSecondsPerMile,
  METERS_PER_MILE
} from '../RunUtility'

const makeRun = (overrides: Partial<Run> = {}): Run => ({
  id: 'run-1',
  date: new Date(2026, 6, 1, 10).getTime(),
  distanceMiles: 2,
  durationSeconds: 1800,
  calories: 200,
  ...overrides
})

describe('METERS_PER_MILE', () => {
  it('is the number of meters in a mile', () => {
    expect(METERS_PER_MILE).toBeCloseTo(1609.34, 2)
  })
})

describe('formatRunDuration', () => {
  it('formats zero seconds', () => {
    expect(formatRunDuration(0)).toBe('00:00')
  })

  it('carries rounded seconds into the minute at the boundary', () => {
    expect(formatRunDuration(59.5)).toBe('01:00')
    expect(formatRunDuration(119.7)).toBe('02:00')
  })

  it('formats under a minute with padding', () => {
    expect(formatRunDuration(5)).toBe('00:05')
  })

  it('formats whole minutes', () => {
    expect(formatRunDuration(1800)).toBe('30:00')
  })

  it('formats minutes and seconds', () => {
    expect(formatRunDuration(90)).toBe('01:30')
  })

  it('keeps counting minutes past an hour', () => {
    expect(formatRunDuration(3661)).toBe('61:01')
  })

  it('rounds fractional seconds', () => {
    expect(formatRunDuration(65.4)).toBe('01:05')
  })
})

describe('getPaceSecondsPerMile', () => {
  it('returns 0 for a zero-distance run', () => {
    expect(getPaceSecondsPerMile(makeRun({distanceMiles: 0, durationSeconds: 600}))).toBe(0)
  })

  it('divides duration by distance', () => {
    expect(getPaceSecondsPerMile(makeRun({distanceMiles: 2, durationSeconds: 1800}))).toBe(900)
  })

  it('handles fractional distances', () => {
    expect(getPaceSecondsPerMile(makeRun({distanceMiles: 0.5, durationSeconds: 300}))).toBe(600)
  })
})

describe('formatPace', () => {
  it('formats pace as MM:SS per mile', () => {
    expect(formatPace(makeRun({distanceMiles: 2, durationSeconds: 1800}))).toBe('15:00')
  })

  it('formats a zero-distance run as 00:00', () => {
    expect(formatPace(makeRun({distanceMiles: 0, durationSeconds: 600}))).toBe('00:00')
  })
})

describe('getMilesThisMonth', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-03T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns 0 for no runs', () => {
    expect(getMilesThisMonth([])).toBe(0)
  })

  it('sums the distance of runs in the current month', () => {
    const runs = [
      makeRun({date: new Date(2026, 6, 1).getTime(), distanceMiles: 2}),
      makeRun({date: new Date(2026, 6, 2).getTime(), distanceMiles: 3.5})
    ]

    expect(getMilesThisMonth(runs)).toBe(5.5)
  })

  it('excludes runs from other months', () => {
    const runs = [
      makeRun({date: new Date(2026, 5, 30).getTime(), distanceMiles: 4}),
      makeRun({date: new Date(2026, 6, 1).getTime(), distanceMiles: 2})
    ]

    expect(getMilesThisMonth(runs)).toBe(2)
  })

  it('excludes runs from the same month in a different year', () => {
    const runs = [makeRun({date: new Date(2025, 6, 3).getTime(), distanceMiles: 4})]

    expect(getMilesThisMonth(runs)).toBe(0)
  })
})

describe('daysAgo', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-03T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns now for zero days', () => {
    expect(daysAgo(0)).toBe(Date.now())
  })

  it('subtracts whole days from now', () => {
    expect(daysAgo(3)).toBe(Date.now() - 3 * ONE_DAY_MS)
  })
})

describe('formatDistanceMiles', () => {
  it('formats zero meters', () => {
    expect(formatDistanceMiles(0)).toBe('0.00')
  })

  it('formats exactly one mile', () => {
    expect(formatDistanceMiles(METERS_PER_MILE)).toBe('1.00')
  })

  it('rounds to two decimal places', () => {
    expect(formatDistanceMiles(5000)).toBe('3.11')
  })
})

describe('formatElapsedTime', () => {
  it('formats zero milliseconds', () => {
    expect(formatElapsedTime(0)).toBe('00:00')
  })

  it('formats milliseconds as MM:SS', () => {
    expect(formatElapsedTime(90000)).toBe('01:30')
  })

  it('clamps negative input to zero', () => {
    expect(formatElapsedTime(-5000)).toBe('00:00')
  })
})

describe('formatPaceFromSecPerKm', () => {
  it('returns a placeholder for zero pace', () => {
    expect(formatPaceFromSecPerKm(0)).toBe('--:--')
  })

  it('returns a placeholder for negative pace', () => {
    expect(formatPaceFromSecPerKm(-100)).toBe('--:--')
  })

  it('returns a placeholder for an infinite pace', () => {
    expect(formatPaceFromSecPerKm(Infinity)).toBe('--:--')
  })

  it('returns a placeholder for NaN', () => {
    expect(formatPaceFromSecPerKm(NaN)).toBe('--:--')
  })

  it('converts seconds per km to a MM:SS per-mile pace', () => {
    expect(formatPaceFromSecPerKm(300)).toBe('08:03')
  })
})

describe('formatSpeedMph', () => {
  it('formats zero speed', () => {
    expect(formatSpeedMph(0)).toBe('0.0')
  })

  it('converts meters per second to mph with one decimal', () => {
    expect(formatSpeedMph(1)).toBe('2.2')
  })

  it('formats a 10 mph speed exactly', () => {
    expect(formatSpeedMph(4.4704)).toBe('10.0')
  })
})

import {DailySummary} from '@data/models/DailyMacros'

import {ON_GOAL_LABEL} from '@constants/strings'

import {
  assembleLast7Days,
  averageCalories,
  barHeightPct,
  buildLast7DayKeys,
  chartMaxCalories,
  formatDaySubtitle,
  formatDayTitle,
  goalDeltaLabel,
  goalLinePct,
  isNearGoal,
  MIN_BAR_HEIGHT_PCT
} from '../index.util'

const summary = (date: string, calories: number, overrides: Partial<DailySummary> = {}): DailySummary => ({
  date,
  mealCount: 3,
  calories,
  protein: 92,
  carbs: 188,
  fat: 61,
  ...overrides
})

describe('buildLast7DayKeys', () => {
  it('returns 7 ascending day keys ending on the given day', () => {
    expect(buildLast7DayKeys('2026-07-03')).toEqual([
      '2026-06-27',
      '2026-06-28',
      '2026-06-29',
      '2026-06-30',
      '2026-07-01',
      '2026-07-02',
      '2026-07-03'
    ])
  })

  it('walks back across a year boundary', () => {
    expect(buildLast7DayKeys('2026-01-02')).toEqual([
      '2025-12-27',
      '2025-12-28',
      '2025-12-29',
      '2025-12-30',
      '2025-12-31',
      '2026-01-01',
      '2026-01-02'
    ])
  })
})

describe('assembleLast7Days', () => {
  const dayKeys = buildLast7DayKeys('2026-07-03')

  it('maps summaries onto their calendar day', () => {
    const days = assembleLast7Days(dayKeys, [summary('2026-07-01', 1590)])
    const mapped = days.find(day => day.dateIso === '2026-07-01')

    expect(mapped?.calories).toBe(1590)
    expect(mapped?.hasData).toBe(true)
    expect(mapped?.dayOfMonth).toBe(1)
  })

  it('marks days without a summary as missing with zero calories', () => {
    const days = assembleLast7Days(dayKeys, [summary('2026-07-01', 1590)])
    const missing = days.find(day => day.dateIso === '2026-06-28')

    expect(missing?.calories).toBe(0)
    expect(missing?.hasData).toBe(false)
  })

  it('marks only the final key as today', () => {
    const days = assembleLast7Days(dayKeys, [])

    expect(days.filter(day => day.isToday).map(day => day.dateIso)).toEqual(['2026-07-03'])
  })

  it('keeps the keys in order and produces day-of-month labels', () => {
    const days = assembleLast7Days(dayKeys, [])

    expect(days.map(day => day.dayOfMonth)).toEqual([27, 28, 29, 30, 1, 2, 3])
  })
})

describe('averageCalories', () => {
  const dayKeys = buildLast7DayKeys('2026-07-03')

  it('averages only over days with data', () => {
    const days = assembleLast7Days(dayKeys, [summary('2026-07-01', 1500), summary('2026-07-02', 2000)])

    expect(averageCalories(days)).toBe(1750)
  })

  it('rounds to the nearest calorie', () => {
    const days = assembleLast7Days(dayKeys, [summary('2026-07-01', 1500), summary('2026-07-02', 1501)])

    expect(averageCalories(days)).toBe(1501)
  })

  it('returns 0 when no day has data', () => {
    expect(averageCalories(assembleLast7Days(dayKeys, []))).toBe(0)
  })
})

describe('chartMaxCalories', () => {
  const dayKeys = buildLast7DayKeys('2026-07-03')

  it('scales against the goal with headroom when the goal is tallest', () => {
    const days = assembleLast7Days(dayKeys, [summary('2026-07-01', 1500)])

    expect(chartMaxCalories(days, 1800)).toBeCloseTo(1944)
  })

  it('scales against the tallest day with headroom when it exceeds the goal', () => {
    const days = assembleLast7Days(dayKeys, [summary('2026-07-01', 2500)])

    expect(chartMaxCalories(days, 1800)).toBeCloseTo(2700)
  })
})

describe('barHeightPct', () => {
  it('computes the height as a percentage of the chart max', () => {
    expect(barHeightPct(1000, 2000)).toBe(50)
  })

  it('keeps a minimal stub for missing days', () => {
    expect(barHeightPct(0, 2000)).toBe(MIN_BAR_HEIGHT_PCT)
  })

  it('falls back to the stub when the chart max is zero', () => {
    expect(barHeightPct(0, 0)).toBe(MIN_BAR_HEIGHT_PCT)
  })
})

describe('goalLinePct', () => {
  it('positions the goal line as a percentage of the chart max', () => {
    expect(goalLinePct(1800, 1944)).toBeCloseTo(92.59, 1)
  })

  it('returns 0 when the chart max is zero', () => {
    expect(goalLinePct(1800, 0)).toBe(0)
  })

  it('never exceeds the top of the chart', () => {
    expect(goalLinePct(2500, 2000)).toBe(100)
  })
})

describe('isNearGoal', () => {
  it('is true at or above 90% of the goal', () => {
    expect(isNearGoal(1620, 1800)).toBe(true)
    expect(isNearGoal(1800, 1800)).toBe(true)
  })

  it('is false below 90% of the goal', () => {
    expect(isNearGoal(1619, 1800)).toBe(false)
  })

  it('is false when there is no goal', () => {
    expect(isNearGoal(500, 0)).toBe(false)
  })
})

describe('goalDeltaLabel', () => {
  it('labels days at or above the goal as on goal', () => {
    expect(goalDeltaLabel(1833, 1800)).toEqual({label: ON_GOAL_LABEL, isOnGoal: true})
    expect(goalDeltaLabel(1800, 1800)).toEqual({label: ON_GOAL_LABEL, isOnGoal: true})
  })

  it('labels days below the goal with a minus-prefixed delta', () => {
    expect(goalDeltaLabel(1590, 1800)).toEqual({label: '−210', isOnGoal: false})
  })

  it('formats large deltas with thousands separators', () => {
    expect(goalDeltaLabel(500, 1800)).toEqual({label: '−1,300', isOnGoal: false})
  })
})

describe('formatDayTitle', () => {
  it('formats a day key as weekday, month and day', () => {
    expect(formatDayTitle('2026-07-02')).toBe('Thursday, July 2')
  })

  it('ignores any time component', () => {
    expect(formatDayTitle('2026-06-28T00:00:00.000Z')).toBe('Sunday, June 28')
  })
})

describe('formatDaySubtitle', () => {
  it('formats meal count and macro grams', () => {
    expect(formatDaySubtitle(summary('2026-07-02', 1833))).toBe('3 meals · 92g P · 188g C · 61g F')
  })

  it('uses the singular label for a single meal', () => {
    expect(formatDaySubtitle(summary('2026-07-02', 400, {mealCount: 1, protein: 20, carbs: 30, fat: 10}))).toBe(
      '1 meal · 20g P · 30g C · 10g F'
    )
  })
})

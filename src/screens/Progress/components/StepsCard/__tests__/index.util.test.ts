import {clampBarIndex, computeGoalProgress, computeStepBars, formatDayDate, formatDayLabel} from '../index.util'

describe('computeStepBars', () => {
  const weekSteps = [
    {date: '2026-06-27', steps: 4000},
    {date: '2026-06-28', steps: 0},
    {date: '2026-07-03', steps: 10000}
  ]

  it('scales bars against the busiest day', () => {
    const bars = computeStepBars(weekSteps, 10000)

    expect(bars[0].heightPct).toBeCloseTo(0.4)
    expect(bars[2].heightPct).toBe(1)
  })

  it('marks days that hit the goal', () => {
    const bars = computeStepBars(weekSteps, 10000)

    expect(bars.map(bar => bar.hitGoal)).toEqual([false, false, true])
  })

  it('uses local weekday letters', () => {
    // 2026-07-03 is a Friday
    expect(computeStepBars(weekSteps, 10000)[2].label).toBe('F')
  })

  it('handles an all-zero week without dividing by zero', () => {
    const bars = computeStepBars(
      [
        {date: '2026-07-02', steps: 0},
        {date: '2026-07-03', steps: 0}
      ],
      10000
    )

    expect(bars.every(bar => bar.heightPct === 0)).toBe(true)
  })
})

describe('computeGoalProgress', () => {
  it('returns the fraction of the goal', () => {
    expect(computeGoalProgress(5000, 10000)).toBe(0.5)
  })

  it('caps at 1', () => {
    expect(computeGoalProgress(15000, 10000)).toBe(1)
  })

  it('returns 0 for a zero goal', () => {
    expect(computeGoalProgress(5000, 0)).toBe(0)
  })
})

describe('formatDayLabel', () => {
  it('labels today', () => {
    expect(formatDayLabel('2026-07-03', true)).toBe('STEPS TODAY')
  })

  it('labels a previous day with its weekday name', () => {
    // 2026-06-27 is a Saturday
    expect(formatDayLabel('2026-06-27', false)).toBe('STEPS Saturday')
  })
})

describe('formatDayDate', () => {
  it('formats the day as a short date', () => {
    expect(formatDayDate('2026-06-27')).toBe('Jun 27')
  })
})

describe('clampBarIndex', () => {
  it('maps a touch to the bar column under it', () => {
    expect(clampBarIndex(0, 700, 7)).toBe(0)
    expect(clampBarIndex(150, 700, 7)).toBe(1)
    expect(clampBarIndex(699, 700, 7)).toBe(6)
  })

  it('clamps touches outside the row', () => {
    expect(clampBarIndex(-20, 700, 7)).toBe(0)
    expect(clampBarIndex(900, 700, 7)).toBe(6)
  })
})

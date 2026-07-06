import {WeeklyWorkoutSummary} from '@data/models/WeeklyWorkoutSummary'

import {computeWeeklyBars} from '../index.util'

const WEEK_LABELS = ['5/18', '5/25', '6/1', '6/8', '6/15', '6/22', '6/29']
const MAX_BAR_HEIGHT = 100

const summary = (startOfWeek: string, completedWorkouts: number): WeeklyWorkoutSummary =>
  ({startOfWeek, completedWorkouts}) as WeeklyWorkoutSummary

describe('computeWeeklyBars', () => {
  it('returns one bar per week label in order', () => {
    const bars = computeWeeklyBars(WEEK_LABELS, [], 3, MAX_BAR_HEIGHT)

    expect(bars.map(bar => bar.label)).toEqual(WEEK_LABELS)
  })

  it('marks only the last week as current', () => {
    const bars = computeWeeklyBars(WEEK_LABELS, [], 3, MAX_BAR_HEIGHT)

    expect(bars.filter(bar => bar.isCurrentWeek).map(bar => bar.label)).toEqual(['6/29'])
  })

  it('scales bars against the busiest week when it exceeds the target', () => {
    const bars = computeWeeklyBars(WEEK_LABELS, [summary('6/1', 6), summary('6/8', 3)], 3, MAX_BAR_HEIGHT)

    expect(bars.find(bar => bar.label === '6/1')?.barHeight).toBe(100)
    expect(bars.find(bar => bar.label === '6/8')?.barHeight).toBe(50)
  })

  it('scales bars against the target when no week reaches it', () => {
    const bars = computeWeeklyBars(WEEK_LABELS, [summary('6/1', 2)], 4, MAX_BAR_HEIGHT)

    expect(bars.find(bar => bar.label === '6/1')?.barHeight).toBe(50)
  })

  it('flags weeks that hit the target', () => {
    const bars = computeWeeklyBars(WEEK_LABELS, [summary('6/1', 3), summary('6/8', 2)], 3, MAX_BAR_HEIGHT)

    expect(bars.find(bar => bar.label === '6/1')?.didHitTarget).toBe(true)
    expect(bars.find(bar => bar.label === '6/8')?.didHitTarget).toBe(false)
  })

  it('keeps a sliver of bar for empty weeks', () => {
    const bars = computeWeeklyBars(WEEK_LABELS, [], 3, MAX_BAR_HEIGHT)

    bars.forEach(bar => {
      expect(bar.completedWorkouts).toBe(0)
      expect(bar.barHeight).toBe(4)
    })
  })
})

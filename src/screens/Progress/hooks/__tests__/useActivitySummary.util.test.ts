import {HourlySteps} from '@data/models/DailySteps'
import {RunRecord} from '@data/models/RunRecord'
import {WeighIn} from '@data/models/WeighIn'
import {WorkoutSummary} from '@data/models/WorkoutSummary'

import {
  buildActivityDays,
  buildLastNDayKeys,
  computeStepsVsAverage,
  latestBodyWeightLbs,
  toLocalDayKey
} from '../useActivitySummary.util'

const NOW = new Date(2026, 6, 3, 12, 30) // Fri Jul 3 2026, 12:30 local

const makeSummary = (day: string, setsPerExercise: number[]): WorkoutSummary => ({
  day,
  workoutDayId: `workout-${day}`,
  totalWeight: 0,
  totalDurationSeconds: 0,
  totalBodyweightReps: 0,
  exercises: setsPerExercise.map(setsCompleted => ({
    setsCompleted,
    loggingType: 'WEIGHT_REPS',
    exercise: {name: 'Bench Press'}
  }))
})

const makeRun = (localId: string, startedAt: string, calories: number): RunRecord => ({
  localId,
  userId: 'user-1',
  startedAt,
  endedAt: null,
  updatedAt: 0,
  durationSeconds: 1800,
  distanceMeters: 5000,
  calories,
  runType: 'outdoor',
  source: 'gps'
})

const makeWeighIn = (id: string, weight: number, loggedAt: string): WeighIn => ({id, weight, loggedAt})

describe('toLocalDayKey', () => {
  it('formats a date as a local yyyy-MM-dd key', () => {
    expect(toLocalDayKey(NOW)).toBe('2026-07-03')
  })
})

describe('buildLastNDayKeys', () => {
  it('returns keys oldest to newest ending today', () => {
    expect(buildLastNDayKeys(NOW, 3)).toEqual(['2026-07-01', '2026-07-02', '2026-07-03'])
  })

  it('crosses month boundaries', () => {
    expect(buildLastNDayKeys(NOW, 7)[0]).toBe('2026-06-27')
  })
})

describe('latestBodyWeightLbs', () => {
  it('returns the default weight when there are no weigh-ins', () => {
    expect(latestBodyWeightLbs([])).toBe(180)
  })

  it('returns the most recently logged weight regardless of order', () => {
    const weighIns = [
      makeWeighIn('a', 190, '2026-06-01T08:00:00.000Z'),
      makeWeighIn('b', 185, '2026-07-01T08:00:00.000Z'),
      makeWeighIn('c', 195, '2026-05-01T08:00:00.000Z')
    ]

    expect(latestBodyWeightLbs(weighIns)).toBe(185)
  })
})

describe('buildActivityDays', () => {
  const dayKeys = buildLastNDayKeys(NOW, 3)

  const baseInput = {
    dayKeys,
    dailySteps: [
      {date: '2026-07-01', steps: 6910},
      {date: '2026-07-02', steps: 8120},
      {date: '2026-07-03', steps: 8432}
    ],
    summaries: [] as WorkoutSummary[],
    runs: [] as RunRecord[],
    runWindowSteps: {} as Record<string, number>,
    bodyWeightLbs: 180,
    todayLocalWorkout: null
  }

  it('returns one entry per day key with steps mapped by date', () => {
    const days = buildActivityDays(baseInput)

    expect(days).toHaveLength(3)
    expect(days.map(day => day.steps)).toEqual([6910, 8120, 8432])
  })

  it('marks rest days with step-only calories', () => {
    const [day] = buildActivityDays(baseInput)

    expect(day.hadWorkout).toBe(false)
    expect(day.liftKcal).toBe(0)
    expect(day.stepKcal).toBeGreaterThan(0)
    expect(day.totalKcal).toBe(day.stepKcal)
  })

  it('computes lift calories from workout summary sets', () => {
    const days = buildActivityDays({
      ...baseInput,
      summaries: [makeSummary('2026-07-01', [4, 4, 4])]
    })

    expect(days[0].hadWorkout).toBe(true)
    expect(days[0].liftKcal).toBeGreaterThan(0)
    expect(days[0].totalKcal).toBe(days[0].liftKcal + days[0].stepKcal)
  })

  it('handles summary day values that include a time component', () => {
    const days = buildActivityDays({
      ...baseInput,
      summaries: [makeSummary('2026-07-01T00:00:00.000Z', [5])]
    })

    expect(days[0].hadWorkout).toBe(true)
  })

  it('prefers the local workout for today over a server summary', () => {
    const startedAtMs = NOW.getTime() - 47 * 60_000

    const withLocal = buildActivityDays({
      ...baseInput,
      summaries: [makeSummary('2026-07-03', [30])],
      todayLocalWorkout: {completedSets: 15, startedAtMs, completedAtMs: NOW.getTime()}
    })

    const withSummaryOnly = buildActivityDays({
      ...baseInput,
      summaries: [makeSummary('2026-07-03', [30])]
    })

    // 15 sets over 47 wall-clock minutes ≈ 235 kcal, vs 30 sets × 3.5 min fallback
    expect(withLocal[2].liftKcal).toBe(235)
    expect(withSummaryOnly[2].liftKcal).toBeGreaterThan(withLocal[2].liftKcal)
  })

  it('adds run calories and excludes run-window steps from step calories', () => {
    const run = makeRun('run-1', '2026-07-03T08:00:00', 412)

    const [, , today] = buildActivityDays({
      ...baseInput,
      runs: [run],
      runWindowSteps: {'run-1': 4000}
    })

    const [, , todayWithoutRun] = buildActivityDays(baseInput)

    expect(today.hadRun).toBe(true)
    expect(today.runKcal).toBe(412)
    expect(today.stepKcal).toBeLessThan(todayWithoutRun.stepKcal)
    expect(today.steps).toBe(8432)
  })

  it('treats a run with unknown window steps as subtracting nothing', () => {
    const run = makeRun('run-1', '2026-07-03T08:00:00', 412)

    const [, , today] = buildActivityDays({...baseInput, runs: [run], runWindowSteps: {}})
    const [, , todayWithoutRun] = buildActivityDays(baseInput)

    expect(today.stepKcal).toBe(todayWithoutRun.stepKcal)
  })
})

describe('computeStepsVsAverage', () => {
  const bucket = (dayOffset: number, hour: number, steps: number): HourlySteps => {
    const start = new Date(2026, 6, 3 - dayOffset, hour)

    return {start: start.toISOString(), steps}
  }

  it('returns null with fewer than 3 prior days of data', () => {
    const hourly = [bucket(1, 9, 500), bucket(2, 9, 600), bucket(0, 9, 700)]

    expect(computeStepsVsAverage(hourly, NOW)).toBeNull()
  })

  it('compares today against the same-time-of-day average', () => {
    // Three prior days each walked 1,000 steps by noon; today has 1,200
    const hourly = [bucket(1, 9, 1000), bucket(2, 9, 1000), bucket(3, 9, 1000), bucket(0, 9, 1200)]

    expect(computeStepsVsAverage(hourly, NOW)).toBe(20)
  })

  it('ignores prior-day buckets after the current time of day', () => {
    const hourly = [bucket(1, 9, 1000), bucket(1, 18, 9000), bucket(2, 9, 1000), bucket(3, 9, 1000), bucket(0, 9, 1200)]

    expect(computeStepsVsAverage(hourly, NOW)).toBe(20)
  })

  it('weights the current hour by elapsed minutes', () => {
    // NOW is 12:30 → prior-day 12:00 buckets count at half weight
    const hourly = [bucket(1, 12, 1000), bucket(2, 12, 1000), bucket(3, 12, 1000), bucket(0, 9, 600)]

    expect(computeStepsVsAverage(hourly, NOW)).toBe(20)
  })

  it('returns a negative percentage when today is behind', () => {
    const hourly = [bucket(1, 9, 1000), bucket(2, 9, 1000), bucket(3, 9, 1000), bucket(0, 9, 800)]

    expect(computeStepsVsAverage(hourly, NOW)).toBe(-20)
  })

  it('excludes zero-step prior days from the average', () => {
    const hourly = [bucket(1, 9, 1000), bucket(2, 9, 1000), bucket(3, 9, 1000), bucket(4, 9, 0), bucket(0, 9, 1200)]

    expect(computeStepsVsAverage(hourly, NOW)).toBe(20)
  })
})

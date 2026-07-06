import {buildWeekRows, computeCalorieSegments} from '../index.util'

const makeDay = (overrides: Partial<Parameters<typeof buildWeekRows>[0][number]> = {}) => ({
  date: '2026-07-01',
  steps: 6910,
  liftKcal: 366,
  stepKcal: 282,
  runKcal: 0,
  totalKcal: 648,
  hadWorkout: true,
  hadRun: false,
  ...overrides
})

describe('computeCalorieSegments', () => {
  it('drops zero segments', () => {
    expect(computeCalorieSegments(268, 344, 0)).toEqual([
      {key: 'lifts', kcal: 268},
      {key: 'steps', kcal: 344}
    ])
  })

  it('includes runs when present', () => {
    expect(computeCalorieSegments(0, 100, 412).map(segment => segment.key)).toEqual(['steps', 'runs'])
  })

  it('returns empty for a zero day', () => {
    expect(computeCalorieSegments(0, 0, 0)).toEqual([])
  })
})

describe('buildWeekRows', () => {
  it('drops days with no activity', () => {
    const rows = buildWeekRows([makeDay({steps: 0, liftKcal: 0, stepKcal: 0, runKcal: 0, totalKcal: 0})], true)

    expect(rows).toEqual([])
  })

  it('formats a workout day like the design', () => {
    const [row] = buildWeekRows([makeDay()], true)

    expect(row.dayLabel).toBe('Wed · Jul 1')
    expect(row.metaText).toBe('6,910 steps · Workout')
    expect(row.kcalText).toBe('648 kcal')
    expect(row.breakdownText).toBe('366 lifts · 282 steps')
  })

  it('labels a steps-only day as a rest day', () => {
    const [row] = buildWeekRows(
      [makeDay({liftKcal: 0, stepKcal: 459, totalKcal: 459, hadWorkout: false, steps: 11240})],
      true
    )

    expect(row.metaText).toBe('11,240 steps · Rest day')
    expect(row.breakdownText).toBe('steps only')
  })

  it('labels a run day and includes the runs segment', () => {
    const [row] = buildWeekRows(
      [makeDay({liftKcal: 0, stepKcal: 120, runKcal: 412, totalKcal: 532, hadWorkout: false, hadRun: true})],
      true
    )

    expect(row.metaText).toBe('6,910 steps · Run day')
    expect(row.breakdownText).toBe('412 runs · 120 steps')
  })

  it('omits the step count when steps are unavailable', () => {
    const [row] = buildWeekRows([makeDay()], false)

    expect(row.metaText).toBe('Workout')
  })
})

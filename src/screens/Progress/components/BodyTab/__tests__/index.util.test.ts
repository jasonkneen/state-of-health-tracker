import {WeighIn} from '@data/models/WeighIn'

import {
  buildWeighInRows,
  buildWeightTrend,
  formatListWeight,
  formatSignedDelta,
  formatWeightValue,
  getTimeOfDay,
  getToGoLbs,
  getWeightDelta,
  isDeltaTowardGoal,
  roundToTenth
} from '../index.util'

const weighIn = (id: string, weight: number, loggedAt: string): WeighIn => ({id, weight, loggedAt})

describe('buildWeightTrend', () => {
  it('sorts weigh-ins ascending by loggedAt and maps to chart points', () => {
    const trend = buildWeightTrend([
      weighIn('b', 180.6, '2026-06-28T08:00:00.000Z'),
      weighIn('c', 180.0, '2026-07-02T08:00:00.000Z'),
      weighIn('a', 180.4, '2026-06-24T08:00:00.000Z')
    ])

    expect(trend).toEqual([
      {date: '2026-06-24T08:00:00.000Z', value: 180.4},
      {date: '2026-06-28T08:00:00.000Z', value: 180.6},
      {date: '2026-07-02T08:00:00.000Z', value: 180.0}
    ])
  })

  it('returns an empty array for no weigh-ins', () => {
    expect(buildWeightTrend([])).toEqual([])
  })
})

describe('getWeightDelta', () => {
  it('returns null when there are fewer than two points', () => {
    expect(getWeightDelta([])).toBeNull()
    expect(getWeightDelta([{date: '2026-07-02T08:00:00.000Z', value: 180}])).toBeNull()
  })

  it('computes the change from the first to the last point in lbs and weeks', () => {
    const delta = getWeightDelta([
      {date: '2026-04-13T08:00:00.000Z', value: 187},
      {date: '2026-07-02T08:00:00.000Z', value: 180}
    ])

    expect(delta).toEqual({lbs: -7, weeks: 11})
  })

  it('never reports less than one week', () => {
    const delta = getWeightDelta([
      {date: '2026-07-01T08:00:00.000Z', value: 181},
      {date: '2026-07-02T08:00:00.000Z', value: 180}
    ])

    expect(delta?.weeks).toBe(1)
  })
})

describe('weight formatting', () => {
  it('drops the decimal for whole weights and keeps one decimal otherwise', () => {
    expect(formatWeightValue(180)).toBe('180')
    expect(formatWeightValue(180.4)).toBe('180.4')
    expect(formatWeightValue(180.44)).toBe('180.4')
  })

  it('always shows one decimal in list weights', () => {
    expect(formatListWeight(180)).toBe('180.0')
    expect(formatListWeight(180.46)).toBe('180.5')
  })

  it('signs deltas and keeps one decimal', () => {
    expect(formatSignedDelta(0.2)).toBe('+0.2')
    expect(formatSignedDelta(-0.6)).toBe('-0.6')
    expect(formatSignedDelta(0)).toBe('0.0')
  })

  it('rounds to the nearest tenth', () => {
    expect(roundToTenth(180.45)).toBe(180.5)
    expect(roundToTenth(-7.04)).toBe(-7)
  })
})

describe('getTimeOfDay', () => {
  it('buckets the local hour into morning, afternoon and evening', () => {
    const morning = new Date(2026, 6, 2, 8, 0, 0).toISOString()
    const afternoon = new Date(2026, 6, 2, 14, 0, 0).toISOString()
    const evening = new Date(2026, 6, 2, 20, 0, 0).toISOString()

    expect(getTimeOfDay(morning)).toBe('morning')
    expect(getTimeOfDay(afternoon)).toBe('afternoon')
    expect(getTimeOfDay(evening)).toBe('evening')
  })
})

describe('buildWeighInRows', () => {
  it('sorts newest first and computes the change from the previous weigh-in', () => {
    const rows = buildWeighInRows([
      weighIn('a', 180.4, '2026-06-24T08:00:00.000Z'),
      weighIn('c', 180.0, '2026-07-02T08:00:00.000Z'),
      weighIn('b', 180.6, '2026-06-28T08:00:00.000Z')
    ])

    expect(rows.map(row => row.weighIn.id)).toEqual(['c', 'b', 'a'])
    expect(rows.map(row => row.deltaFromPrevious)).toEqual([-0.6, 0.2, null])
  })
})

describe('isDeltaTowardGoal', () => {
  it('treats losing weight as progress when the goal is below the current weight', () => {
    expect(isDeltaTowardGoal(-7, 180, 175)).toBe(true)
    expect(isDeltaTowardGoal(3, 180, 175)).toBe(false)
  })

  it('treats gaining weight as progress when the goal is above the current weight', () => {
    expect(isDeltaTowardGoal(4, 150, 160)).toBe(true)
    expect(isDeltaTowardGoal(-2, 150, 160)).toBe(false)
  })

  it('defaults to treating loss as progress when no goal is set', () => {
    expect(isDeltaTowardGoal(-1, 180, null)).toBe(true)
    expect(isDeltaTowardGoal(1, 180, null)).toBe(false)
  })
})

describe('getToGoLbs', () => {
  it('returns the absolute distance to the goal', () => {
    expect(getToGoLbs(180, 175)).toBe(5)
    expect(getToGoLbs(170, 175)).toBe(5)
  })

  it('returns null when no goal is set', () => {
    expect(getToGoLbs(180, null)).toBeNull()
  })
})

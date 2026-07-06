import {RunRecord} from '@data/models/RunRecord'

import {
  buildRunSummaryTiles,
  formatRunDateLine,
  formatRunHeroDistance,
  formatRunOverline,
  toRoutePoints
} from '../index.util'

const makeRecord = (overrides: Partial<RunRecord> = {}): RunRecord => ({
  localId: 'local-1',
  userId: 'user-1',
  startedAt: '2026-06-01T10:00:00.000Z',
  updatedAt: 0,
  durationSeconds: 600,
  distanceMeters: 1609.34,
  avgPaceSecPerKm: 372.8,
  calories: 105.4,
  runType: 'OUTDOOR',
  source: 'GPS',
  ...overrides
})

describe('buildRunSummaryTiles', () => {
  it('builds the four stat tiles from the record', () => {
    const tiles = buildRunSummaryTiles(makeRecord())

    expect(tiles.map(tile => tile.label)).toEqual(['Time', 'Avg Pace', 'Avg Speed', 'Calories'])
    expect(tiles.map(tile => tile.unit)).toEqual([undefined, '/mi', 'mph', 'cal'])
    expect(tiles[0].value).toBe('10:00')
    expect(tiles[3].value).toBe('105')
  })

  it('shows zero speed for a zero-duration record instead of dividing by zero', () => {
    const tiles = buildRunSummaryTiles(makeRecord({durationSeconds: 0}))

    expect(tiles[2].value).toBe('0.0')
  })

  it('defaults missing pace and calories', () => {
    const tiles = buildRunSummaryTiles(makeRecord({avgPaceSecPerKm: null, calories: null}))

    expect(tiles[3].value).toBe('0')
  })
})

describe('formatRunHeroDistance', () => {
  it('formats the distance in miles', () => {
    expect(formatRunHeroDistance(makeRecord())).toBe('1.00')
  })
})

describe('formatRunOverline', () => {
  it('builds the overline from the run type', () => {
    expect(formatRunOverline(makeRecord())).toBe('OUTDOOR Run')
  })
})

describe('formatRunDateLine', () => {
  it('formats the start time as a weekday, date, and time line', () => {
    // Local-time ISO string (no Z) keeps the expectation timezone-independent
    expect(formatRunDateLine('2026-07-03T14:32:00')).toBe('Friday, July 3 · 2:32 PM')
  })
})

describe('toRoutePoints', () => {
  it('decodes the stored polyline into map points', () => {
    const polyline = JSON.stringify([
      {lat: 40, lng: -105},
      {lat: 40.001, lng: -105.001}
    ])

    expect(toRoutePoints(polyline)).toEqual([
      {latitude: 40, longitude: -105},
      {latitude: 40.001, longitude: -105.001}
    ])
  })

  it('returns an empty route for missing polylines', () => {
    expect(toRoutePoints(null)).toEqual([])
    expect(toRoutePoints(undefined)).toEqual([])
  })
})

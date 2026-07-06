import {ExerciseHistoryEntry} from '@data/models/PersonalRecord'

import {
  buildTopSetTrend,
  formatCount,
  getTopSetDelta,
  groupHistoryIntoSessions,
  parseDayKey,
  SessionSummary,
  TopSetTrendPoint
} from '../index.util'

const makeEntry = (overrides: Partial<ExerciseHistoryEntry> = {}): ExerciseHistoryEntry => ({
  setId: 'set-1',
  date: '2026-07-01T10:00:00.000Z',
  reps: 5,
  weight: 100,
  addedWeight: null,
  durationSeconds: null,
  distanceMeters: null,
  rpe: null,
  ...overrides
})

const makeSession = (overrides: Partial<SessionSummary> = {}): SessionSummary => ({
  date: '2026-07-01',
  topSet: {weight: 100, reps: 5},
  setCount: 3,
  estimatedOneRepMax: 117,
  ...overrides
})

const makePoint = (overrides: Partial<TopSetTrendPoint> = {}): TopSetTrendPoint => ({
  date: '2026-07-01',
  weight: 100,
  reps: 5,
  score: 100,
  ...overrides
})

describe('groupHistoryIntoSessions', () => {
  it('returns an empty array for empty history', () => {
    expect(groupHistoryIntoSessions([])).toEqual([])
  })

  it('groups sets from the same day into a single session', () => {
    const history = [
      makeEntry({setId: 'a', date: '2026-07-01T10:00:00.000Z'}),
      makeEntry({setId: 'b', date: '2026-07-01T10:15:00.000Z'}),
      makeEntry({setId: 'c', date: '2026-07-01T10:30:00.000Z'})
    ]

    const sessions = groupHistoryIntoSessions(history)

    expect(sessions).toHaveLength(1)
    expect(sessions[0].date).toBe('2026-07-01')
    expect(sessions[0].setCount).toBe(3)
  })

  it('orders sessions newest first', () => {
    const history = [
      makeEntry({date: '2026-06-15T10:00:00.000Z'}),
      makeEntry({date: '2026-07-01T10:00:00.000Z'}),
      makeEntry({date: '2026-06-22T10:00:00.000Z'})
    ]

    const sessions = groupHistoryIntoSessions(history)

    expect(sessions.map(session => session.date)).toEqual(['2026-07-01', '2026-06-22', '2026-06-15'])
  })

  it('ranks the top set by estimated 1RM rather than raw volume', () => {
    // 225 × 6 → est 270 beats 135 × 20 → est 225, despite less total volume
    const history = [
      makeEntry({setId: 'volume', weight: 135, reps: 20}),
      makeEntry({setId: 'heavy', weight: 225, reps: 6})
    ]

    const [session] = groupHistoryIntoSessions(history)

    expect(session.topSet).toEqual({weight: 225, reps: 6})
    expect(session.estimatedOneRepMax).toBe(270)
  })

  it('rounds the estimated 1RM', () => {
    // 102 × 3 → 102 * 1.1 = 112.2 → 112
    const [session] = groupHistoryIntoSessions([makeEntry({weight: 102, reps: 3})])

    expect(session.estimatedOneRepMax).toBe(112)
  })

  it('uses addedWeight when weight is null', () => {
    const [session] = groupHistoryIntoSessions([makeEntry({weight: null, addedWeight: 25, reps: 10})])

    expect(session.topSet).toEqual({weight: 25, reps: 10})
  })

  it('counts sets without weight or reps in setCount but skips them for the 1RM', () => {
    const history = [
      makeEntry({setId: 'timed', weight: null, addedWeight: null, reps: null, durationSeconds: 60}),
      makeEntry({setId: 'no-reps', weight: 100, reps: null}),
      makeEntry({setId: 'working', weight: 100, reps: 5})
    ]

    const [session] = groupHistoryIntoSessions(history)

    expect(session.setCount).toBe(3)
    expect(session.topSet).toEqual({weight: 100, reps: 5})
  })

  it('returns a null top set and 1RM for a session with no rankable sets', () => {
    const history = [makeEntry({weight: null, addedWeight: null, reps: null, durationSeconds: 90})]

    const [session] = groupHistoryIntoSessions(history)

    expect(session.topSet).toBeNull()
    expect(session.estimatedOneRepMax).toBeNull()
    expect(session.setCount).toBe(1)
  })

  describe('reps-only mode (bodyweight exercises)', () => {
    it('ranks the top set by reps with weight 0 and no 1RM', () => {
      const history = [
        makeEntry({setId: 'a', weight: null, reps: 12}),
        makeEntry({setId: 'b', weight: null, reps: 20}),
        makeEntry({setId: 'c', weight: null, reps: 15})
      ]

      const [session] = groupHistoryIntoSessions(history, true)

      expect(session.topSet).toEqual({weight: 0, reps: 20})
      expect(session.estimatedOneRepMax).toBeNull()
    })

    it('ignores any logged weight when ranking', () => {
      // 5 heavy reps must not outrank 20 bodyweight reps
      const history = [makeEntry({setId: 'a', weight: 100, reps: 5}), makeEntry({setId: 'b', weight: null, reps: 20})]

      const [session] = groupHistoryIntoSessions(history, true)

      expect(session.topSet).toEqual({weight: 0, reps: 20})
    })

    it('skips sets without reps', () => {
      const history = [makeEntry({weight: null, reps: null, durationSeconds: 60})]

      const [session] = groupHistoryIntoSessions(history, true)

      expect(session.topSet).toBeNull()
      expect(session.setCount).toBe(1)
    })
  })
})

describe('buildTopSetTrend', () => {
  it('returns an empty array for no sessions', () => {
    expect(buildTopSetTrend([])).toEqual([])
  })

  it('orders points chronologically, oldest first', () => {
    const sessions = [
      makeSession({date: '2026-07-01'}),
      makeSession({date: '2026-06-15'}),
      makeSession({date: '2026-06-22'})
    ]

    const trend = buildTopSetTrend(sessions)

    expect(trend.map(point => point.date)).toEqual(['2026-06-15', '2026-06-22', '2026-07-01'])
  })

  it('skips sessions without a top set', () => {
    const sessions = [
      makeSession({date: '2026-06-15'}),
      makeSession({date: '2026-06-22', topSet: null, estimatedOneRepMax: null})
    ]

    const trend = buildTopSetTrend(sessions)

    expect(trend).toHaveLength(1)
    expect(trend[0].date).toBe('2026-06-15')
  })

  it('carries the top set weight and reps and scores it with the Epley formula', () => {
    const [point] = buildTopSetTrend([makeSession({topSet: {weight: 225, reps: 6}})])

    expect(point.weight).toBe(225)
    expect(point.reps).toBe(6)
    expect(point.score).toBeCloseTo(270, 5)
  })

  it('scores reps-only top sets by their reps', () => {
    const [point] = buildTopSetTrend([makeSession({topSet: {weight: 0, reps: 18}, estimatedOneRepMax: null})])

    expect(point.weight).toBe(0)
    expect(point.score).toBe(18)
  })
})

describe('getTopSetDelta', () => {
  it('returns null for an empty trend', () => {
    expect(getTopSetDelta([])).toBeNull()
  })

  it('returns null for a single point', () => {
    expect(getTopSetDelta([makePoint()])).toBeNull()
  })

  it('computes the percent change between the first and last points', () => {
    const trend = [
      makePoint({date: '2026-06-01', score: 100}),
      makePoint({date: '2026-06-15', score: 90}),
      makePoint({date: '2026-06-29', score: 110})
    ]

    expect(getTopSetDelta(trend)?.percent).toBe(10)
  })

  it('rounds the percent change', () => {
    const trend = [makePoint({date: '2026-06-01', score: 110}), makePoint({date: '2026-06-29', score: 100})]

    // -9.09% rounds to -9
    expect(getTopSetDelta(trend)?.percent).toBe(-9)
  })

  it('computes weeks from the real span of the data', () => {
    const trend = [makePoint({date: '2026-06-01', score: 100}), makePoint({date: '2026-06-29', score: 110})]

    expect(getTopSetDelta(trend)?.weeks).toBe(4)
  })

  it('never reports less than one week', () => {
    const trend = [makePoint({date: '2026-06-01', score: 100}), makePoint({date: '2026-06-03', score: 110})]

    expect(getTopSetDelta(trend)?.weeks).toBe(1)
  })
})

describe('formatCount', () => {
  it('adds thousands separators', () => {
    expect(formatCount(8432)).toBe('8,432')
  })
})

describe('parseDayKey', () => {
  it('parses a day key as a local date', () => {
    const date = parseDayKey('2026-07-03')

    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(6)
    expect(date.getDate()).toBe(3)
  })
})

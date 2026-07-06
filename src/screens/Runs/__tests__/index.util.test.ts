import {Run} from '@data/models/Run'
import {RunRecord} from '@data/models/RunRecord'

import {buildRunBadges, groupRunsByDate, mergeServerAndPendingRuns} from '../index.util'

const makeRecord = (overrides: Partial<RunRecord> = {}): RunRecord => ({
  localId: 'local-1',
  userId: 'user-1',
  startedAt: '2026-06-01T10:00:00.000Z',
  updatedAt: 0,
  durationSeconds: 1800,
  distanceMeters: 3218.68,
  runType: 'outdoor',
  source: 'gps',
  ...overrides
})

const makeRun = (overrides: Partial<Run> = {}): Run => ({
  id: 'run-1',
  date: new Date(2026, 5, 1, 10).getTime(),
  distanceMiles: 2,
  durationSeconds: 1800,
  calories: 200,
  ...overrides
})

describe('mergeServerAndPendingRuns', () => {
  it('drops a pending local run that already exists on the server', () => {
    const server = [makeRecord({id: 'remote-1', localId: 'local-1'})]
    const pending = [makeRecord({id: 'remote-1', localId: 'local-1'})]

    const {runs, pendingLocalIds} = mergeServerAndPendingRuns(server, pending)

    expect(runs).toHaveLength(1)
    expect(pendingLocalIds.size).toBe(0)
  })

  it('keeps pending local runs that have not been synced', () => {
    const server = [makeRecord({id: 'remote-1', localId: 'local-1'})]
    const pending = [makeRecord({localId: 'local-2', startedAt: '2026-06-02T10:00:00.000Z'})]

    const {runs, pendingLocalIds} = mergeServerAndPendingRuns(server, pending)

    expect(runs).toHaveLength(2)
    expect(pendingLocalIds).toEqual(new Set(['local-2']))
  })

  it('sorts merged runs newest first', () => {
    const server = [
      makeRecord({id: 'older', localId: 'local-1', startedAt: '2026-06-01T10:00:00.000Z'}),
      makeRecord({id: 'newer', localId: 'local-2', startedAt: '2026-06-03T10:00:00.000Z'})
    ]

    const {runs} = mergeServerAndPendingRuns(server, [])

    expect(runs.map(run => run.id)).toEqual(['newer', 'older'])
  })

  it('drops a pending run whose create reached the server but whose local record never learned its id', () => {
    const startedAt = '2026-06-05T10:00:00.000Z'
    const server = [makeRecord({id: 'remote-9', localId: 'local-9', startedAt})]
    const pending = [makeRecord({localId: 'local-9', startedAt})]

    const {runs, pendingLocalIds} = mergeServerAndPendingRuns(server, pending)

    expect(runs).toHaveLength(1)
    expect(pendingLocalIds.size).toBe(0)
  })

  it('returns empty results for no runs', () => {
    const {runs, pendingLocalIds} = mergeServerAndPendingRuns([], [])

    expect(runs).toEqual([])
    expect(pendingLocalIds.size).toBe(0)
  })
})

describe('groupRunsByDate', () => {
  it('groups runs on the same day into one section', () => {
    const runs = [
      makeRun({id: 'a', date: new Date(2026, 5, 1, 8).getTime()}),
      makeRun({id: 'b', date: new Date(2026, 5, 1, 18).getTime()})
    ]

    const sections = groupRunsByDate(runs)

    expect(sections).toHaveLength(1)
    expect(sections[0].data.map(run => run.id)).toEqual(['a', 'b'])
  })

  it('creates a section per day with the formatted date as title', () => {
    const runs = [
      makeRun({id: 'a', date: new Date(2026, 5, 2).getTime()}),
      makeRun({id: 'b', date: new Date(2026, 5, 1).getTime()})
    ]

    const sections = groupRunsByDate(runs)

    expect(sections).toHaveLength(2)
    expect(sections[0].title).toBe('June 02, 2026')
    expect(sections[1].title).toBe('June 01, 2026')
  })

  it('returns no sections for an empty history', () => {
    expect(groupRunsByDate([])).toEqual([])
  })
})

describe('buildRunBadges', () => {
  it('returns an empty map for an empty history', () => {
    expect(buildRunBadges([]).size).toBe(0)
  })

  it('never awards best-pace to a zero-distance run', () => {
    const zeroDistanceRun = makeRun({id: 'zero', distanceMiles: 0, durationSeconds: 0})
    const realRun = makeRun({id: 'real', distanceMiles: 2, durationSeconds: 1200})

    const badges = buildRunBadges([zeroDistanceRun, realRun])

    expect(badges.get('real')).toBe('best-pace')
    expect(badges.has('zero')).toBe(false)
  })

  it('awards best-pace and longest to the record-holding runs', () => {
    const fastRun = makeRun({id: 'fast', distanceMiles: 2, durationSeconds: 1000})
    const longRun = makeRun({id: 'long', distanceMiles: 5, durationSeconds: 5000})
    const plainRun = makeRun({id: 'plain', distanceMiles: 1, durationSeconds: 1100})

    const badges = buildRunBadges([fastRun, longRun, plainRun])

    expect(badges.get('fast')).toBe('best-pace')
    expect(badges.get('long')).toBe('longest')
    expect(badges.has('plain')).toBe(false)
  })

  it('awards only best-pace when one run holds both records', () => {
    const recordRun = makeRun({id: 'record', distanceMiles: 5, durationSeconds: 1000})
    const plainRun = makeRun({id: 'plain', distanceMiles: 1, durationSeconds: 1100})

    const badges = buildRunBadges([recordRun, plainRun])

    expect(badges.get('record')).toBe('best-pace')
    expect(badges.size).toBe(1)
  })
})

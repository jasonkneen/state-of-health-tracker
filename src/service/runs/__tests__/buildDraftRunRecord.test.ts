import {RunStats} from '@service/run/runMath'
import * as Location from 'expo-location'

import {buildDraftRunRecord} from '../buildDraftRunRecord'

const makePoint = (latitude: number, longitude: number, timestamp: number): Location.LocationObject => ({
  coords: {latitude, longitude, altitude: null, accuracy: 5, altitudeAccuracy: null, heading: null, speed: null},
  timestamp
})

const stats: RunStats = {
  distanceMeters: 1609.34,
  durationMs: 600_000,
  avgSpeedMetersPerSecond: 2.68,
  avgPaceSecondsPerKm: 372.8,
  calories: 105
}

describe('buildDraftRunRecord', () => {
  it('builds an unsynced draft keyed by the runId', () => {
    const record = buildDraftRunRecord('user-1', {
      runId: 'run-1',
      startTime: 1_000_000,
      endTime: 1_600_000,
      filteredPoints: [makePoint(40, -105, 1_000_000)],
      stats
    })

    expect(record.localId).toBe('run-1')
    expect(record.userId).toBe('user-1')
    expect(record.draft).toBe(true)
    expect(record.synced).toBe(false)
    expect(record.id).toBeUndefined()
  })

  it('persists the stats duration in seconds', () => {
    const record = buildDraftRunRecord('user-1', {
      runId: 'run-1',
      startTime: 1_000_000,
      endTime: 1_600_000,
      filteredPoints: [],
      stats
    })

    expect(record.durationSeconds).toBe(600)
    expect(record.distanceMeters).toBe(1609.34)
    expect(record.startedAt).toBe(new Date(1_000_000).toISOString())
    expect(record.endedAt).toBe(new Date(1_600_000).toISOString())
  })

  it('falls back to the last GPS fix for the end time when none is known', () => {
    const record = buildDraftRunRecord('user-1', {
      runId: 'run-1',
      startTime: 1_000_000,
      filteredPoints: [makePoint(40, -105, 1_000_000), makePoint(40.001, -105, 1_500_000)],
      stats
    })

    expect(record.endedAt).toBe(new Date(1_500_000).toISOString())
  })

  it('encodes the filtered points as the route polyline', () => {
    const record = buildDraftRunRecord('user-1', {
      runId: 'run-1',
      startTime: 1_000_000,
      endTime: 1_600_000,
      filteredPoints: [makePoint(40, -105, 1_000_000)],
      stats
    })

    expect(JSON.parse(record.routePolyline ?? '[]')).toEqual([{lat: 40, lng: -105}])
  })
})

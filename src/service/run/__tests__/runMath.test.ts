import * as Location from 'expo-location'

import {
  calculateRunStats,
  estimateCalories,
  excludePausedPoints,
  filterRunPoints,
  haversineDistanceMeters,
  paceSecondsPerKm,
  processRunPoints
} from '../runMath'

const makePoint = (
  latitude: number,
  longitude: number,
  timestamp: number,
  accuracy: number | null = 5
): Location.LocationObject => ({
  coords: {latitude, longitude, altitude: null, accuracy, altitudeAccuracy: null, heading: null, speed: null},
  timestamp
})

// 0.0001° of latitude ≈ 11.1 meters
const LAT_STEP = 0.0001
const METERS_PER_LAT_STEP = 11.119

describe('haversineDistanceMeters', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversineDistanceMeters({latitude: 40, longitude: -105}, {latitude: 40, longitude: -105})).toBe(0)
  })

  it('measures one degree of latitude as ~111.2 km', () => {
    const distance = haversineDistanceMeters({latitude: 40, longitude: -105}, {latitude: 41, longitude: -105})

    expect(distance).toBeCloseTo(111195, -1)
  })
})

describe('paceSecondsPerKm', () => {
  it('returns 0 for zero distance instead of Infinity', () => {
    expect(paceSecondsPerKm(0, 60_000)).toBe(0)
  })

  it('computes seconds per kilometer', () => {
    expect(paceSecondsPerKm(1000, 300_000)).toBe(300)
  })
})

describe('estimateCalories', () => {
  it('estimates 65 calories per kilometer', () => {
    expect(estimateCalories(1000)).toBe(65)
    expect(estimateCalories(0)).toBe(0)
  })
})

describe('excludePausedPoints', () => {
  const points = [makePoint(40, -105, 1000), makePoint(40.001, -105, 2000), makePoint(40.002, -105, 3000)]

  it('returns all points when there are no pause segments', () => {
    expect(excludePausedPoints(points, [])).toHaveLength(3)
  })

  it('drops points inside a closed pause segment', () => {
    const result = excludePausedPoints(points, [{start: 1500, end: 2500}])

    expect(result.map(point => point.timestamp)).toEqual([1000, 3000])
  })

  it('treats an open segment as paused from its start onward', () => {
    const result = excludePausedPoints(points, [{start: 1500}])

    expect(result.map(point => point.timestamp)).toEqual([1000])
  })
})

describe('filterRunPoints', () => {
  it('drops points with accuracy worse than the threshold', () => {
    const points = [makePoint(40, -105, 1000), makePoint(40 + LAT_STEP, -105, 2000, 50)]

    expect(filterRunPoints(points)).toHaveLength(1)
  })

  it('drops everything before the first known-accuracy fix', () => {
    const points = [makePoint(40, -105, 1000, null), makePoint(40 + LAT_STEP, -105, 2000)]

    expect(filterRunPoints(points).map(point => point.timestamp)).toEqual([2000])
  })

  it('drops segments implying an implausible speed', () => {
    // 111 km apart in 10 seconds — a GPS jump
    const points = [makePoint(40, -105, 1000), makePoint(41, -105, 11_000)]

    expect(filterRunPoints(points)).toHaveLength(1)
  })

  it('skips micro-jitter segments shorter than the minimum distance', () => {
    const points = [makePoint(40, -105, 1000), makePoint(40 + 0.00001, -105, 2000)]

    expect(filterRunPoints(points)).toHaveLength(1)
  })

  it('keeps a plausible running segment', () => {
    // ~11m in 5 seconds ≈ 2.2 m/s
    const points = [makePoint(40, -105, 1000), makePoint(40 + LAT_STEP, -105, 6000)]

    expect(filterRunPoints(points)).toHaveLength(2)
  })
})

describe('calculateRunStats', () => {
  const points = [makePoint(40, -105, 0), makePoint(40 + LAT_STEP, -105, 60_000)]

  it('uses the explicit moving duration for duration, pace, and speed', () => {
    const stats = calculateRunStats(points, 30_000)

    expect(stats.durationMs).toBe(30_000)
    expect(stats.distanceMeters).toBeCloseTo(METERS_PER_LAT_STEP, 1)
    expect(stats.avgSpeedMetersPerSecond).toBeCloseTo(stats.distanceMeters / 30, 5)
  })

  it('falls back to the point-timestamp span when no moving duration is given', () => {
    expect(calculateRunStats(points).durationMs).toBe(60_000)
  })

  it('preserves the moving duration even when there are too few points for distance', () => {
    const stats = calculateRunStats([makePoint(40, -105, 0)], 45_000)

    expect(stats.durationMs).toBe(45_000)
    expect(stats.distanceMeters).toBe(0)
    expect(stats.avgSpeedMetersPerSecond).toBe(0)
  })

  it('never returns a negative duration', () => {
    expect(calculateRunStats(points, -500).durationMs).toBe(0)
  })
})

describe('processRunPoints', () => {
  it('excludes paused points but keeps the moving-clock duration', () => {
    // 3 fixes: t=0, t=60s (inside a pause), t=120s
    const points = [
      makePoint(40, -105, 0),
      makePoint(40 + LAT_STEP, -105, 60_000),
      makePoint(40 + 2 * LAT_STEP, -105, 120_000)
    ]
    const pauseSegments = [{start: 30_000, end: 90_000}]
    const movingDurationMs = 60_000

    const {filteredPoints, stats} = processRunPoints(points, pauseSegments, movingDurationMs)

    expect(filteredPoints.map(point => point.timestamp)).toEqual([0, 120_000])
    // The point span is 120s, but the persisted duration must be the 60s of
    // moving time — this is the paused-time bug regression check.
    expect(stats.durationMs).toBe(60_000)
  })
})

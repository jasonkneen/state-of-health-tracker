import * as Location from 'expo-location'

// Pure math + GPS-filtering module for the Runs feature. No I/O, no React,
// no Zustand — everything here is a plain function over plain data so it's
// trivially unit-testable and reusable from both RunSessionService (live
// finalize) and any future "re-filter an old run" tooling.

export type LatLon = {
  latitude: number
  longitude: number
}

/** A pause window recorded on the session record. `end` is undefined while still paused. */
export type PauseSegment = {
  start: number
  end?: number
}

export type RunFilterOptions = {
  /** Drop points with accuracy worse (numerically greater) than this, in meters. */
  maxAccuracyMeters: number
  /** Drop segments implying a speed greater than this, in meters/second. */
  maxSpeedMetersPerSecond: number
  /** Skip segments shorter than this, in meters, to avoid standing-still jitter. */
  minSegmentDistanceMeters: number
}

export const DEFAULT_RUN_FILTER_OPTIONS: RunFilterOptions = {
  maxAccuracyMeters: 30,
  maxSpeedMetersPerSecond: 7,
  minSegmentDistanceMeters: 3
}

export type RunStats = {
  distanceMeters: number
  durationMs: number
  avgSpeedMetersPerSecond: number
  /** Seconds per kilometer. 0 when distance is 0 (avoids Infinity). */
  avgPaceSecondsPerKm: number
  calories: number
}

export type ProcessedRun = {
  filteredPoints: Location.LocationObject[]
  stats: RunStats
}

const EARTH_RADIUS_METERS = 6371000

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180

/** Great-circle distance between two coordinates, in meters. */
export const haversineDistanceMeters = (a: LatLon, b: LatLon): number => {
  const dLat = toRadians(b.latitude - a.latitude)
  const dLon = toRadians(b.longitude - a.longitude)

  const sinDLat = Math.sin(dLat / 2)
  const sinDLon = Math.sin(dLon / 2)

  const h = sinDLat * sinDLat + sinDLon * sinDLon * Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude))
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))

  return EARTH_RADIUS_METERS * c
}

/** Rough calorie estimate consistent with the old branch's formula. */
export const estimateCalories = (distanceMeters: number): number => Math.round((distanceMeters / 1000) * 65)

/** Pace in seconds/km for a given distance + duration. Returns 0 when distance is 0. */
export const paceSecondsPerKm = (distanceMeters: number, durationMs: number): number => {
  if (distanceMeters <= 0) {
    return 0
  }

  const durationSeconds = durationMs / 1000
  const distanceKm = distanceMeters / 1000

  return durationSeconds / distanceKm
}

/**
 * Drops points whose timestamp falls inside a pause segment. A segment with
 * no `end` is treated as open-ended (still paused), excluding every point
 * from `start` onward — callers should normally close the trailing pause
 * segment before finalizing a run, but this stays safe either way.
 */
export const excludePausedPoints = (
  points: Location.LocationObject[],
  pauseSegments: PauseSegment[]
): Location.LocationObject[] => {
  if (pauseSegments.length === 0) {
    return points
  }

  return points.filter(point => {
    const isPaused = pauseSegments.some(segment => {
      const end = segment.end ?? Infinity

      return point.timestamp >= segment.start && point.timestamp <= end
    })

    return !isPaused
  })
}

/**
 * GPS quality pass (plan doc §5): warm-up (nothing before the first
 * acceptable-accuracy fix), drop poor-accuracy fixes, drop implausible
 * segment speeds (GPS jumps), and skip micro-jitter segments. Points are
 * assumed to already be in chronological order (the buffer appends in
 * delivery order); this function does not re-sort.
 *
 * Distance/stats should be computed from the *returned* array
 * (`calculateRunStats`) — raw points are kept in the buffer separately so
 * filtering can be re-tuned later without losing data.
 */
export const filterRunPoints = (
  points: Location.LocationObject[],
  options: RunFilterOptions = DEFAULT_RUN_FILTER_OPTIONS
): Location.LocationObject[] => {
  const accuracyFiltered = points.filter(
    point => point.coords.accuracy == null || point.coords.accuracy <= options.maxAccuracyMeters
  )

  // Warm-up: drop everything before the first point that has a known,
  // acceptable accuracy reading. A point with unknown (null) accuracy never
  // starts the warm-up window since we can't trust it.
  const warmUpIndex = accuracyFiltered.findIndex(point => point.coords.accuracy != null)
  const warmedUp = warmUpIndex === -1 ? [] : accuracyFiltered.slice(warmUpIndex)

  const filtered: Location.LocationObject[] = []
  let lastKept: Location.LocationObject | null = null

  for (const point of warmedUp) {
    if (!lastKept) {
      filtered.push(point)
      lastKept = point
      continue
    }

    const segmentDistanceMeters = haversineDistanceMeters(lastKept.coords, point.coords)
    const segmentSeconds = (point.timestamp - lastKept.timestamp) / 1000

    // Non-positive/duplicate timestamps can't produce a meaningful speed —
    // treat as noise and drop rather than divide by zero.
    if (segmentSeconds <= 0) {
      continue
    }

    const impliedSpeed = segmentDistanceMeters / segmentSeconds

    if (impliedSpeed > options.maxSpeedMetersPerSecond) {
      continue
    }

    if (segmentDistanceMeters < options.minSegmentDistanceMeters) {
      // Micro-jitter: skip the point entirely so the next real segment is
      // measured from `lastKept`, not from this near-duplicate fix.
      continue
    }

    filtered.push(point)
    lastKept = point
  }

  return filtered
}

/**
 * Aggregates distance/duration/pace/speed/calories from a (typically
 * already-filtered) polyline.
 *
 * `movingDurationMs` is the session-clock moving time (elapsed minus paused).
 * It must be passed whenever it is known: the point-timestamp span still
 * includes paused wall-clock time (excluding paused *points* doesn't shrink
 * the gap between the surrounding timestamps) and misses the GPS warm-up
 * window, so it is only a fallback.
 */
export const calculateRunStats = (points: Location.LocationObject[], movingDurationMs?: number): RunStats => {
  if (points.length < 2) {
    return {
      distanceMeters: 0,
      durationMs: Math.max(0, movingDurationMs ?? 0),
      avgSpeedMetersPerSecond: 0,
      avgPaceSecondsPerKm: 0,
      calories: 0
    }
  }

  let distanceMeters = 0

  for (let i = 1; i < points.length; i++) {
    distanceMeters += haversineDistanceMeters(points[i - 1].coords, points[i].coords)
  }

  const durationMs = Math.max(0, movingDurationMs ?? points[points.length - 1].timestamp - points[0].timestamp)
  const durationSeconds = durationMs / 1000
  const avgSpeedMetersPerSecond = durationSeconds > 0 ? distanceMeters / durationSeconds : 0

  return {
    distanceMeters,
    durationMs,
    avgSpeedMetersPerSecond,
    avgPaceSecondsPerKm: paceSecondsPerKm(distanceMeters, durationMs),
    calories: estimateCalories(distanceMeters)
  }
}

/**
 * Main entrypoint for finalizing a run: excludes paused-segment points,
 * applies the GPS filtering pass, then computes stats from the result.
 * `rawPoints` should be the full, unfiltered buffer contents (raw points
 * stay persisted separately so this can be re-run later with different
 * options). Pass `movingDurationMs` (session clock, pauses excluded)
 * whenever it is known — see `calculateRunStats`.
 */
export const processRunPoints = (
  rawPoints: Location.LocationObject[],
  pauseSegments: PauseSegment[] = [],
  movingDurationMs?: number,
  options: RunFilterOptions = DEFAULT_RUN_FILTER_OPTIONS
): ProcessedRun => {
  const unpaused = excludePausedPoints(rawPoints, pauseSegments)
  const filteredPoints = filterRunPoints(unpaused, options)
  const stats = calculateRunStats(filteredPoints, movingDurationMs)

  return {filteredPoints, stats}
}

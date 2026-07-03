import {Run} from '@data/models/Run'

import {ONE_DAY_MS} from './DateUtility'

export const formatRunDuration = (durationSeconds: number): string => {
  const totalMinutes = Math.floor(durationSeconds / 60)
  const seconds = Math.round(durationSeconds % 60)

  return `${totalMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export const getPaceSecondsPerMile = (run: Run): number => {
  if (run.distanceMiles === 0) {
    return 0
  }

  return run.durationSeconds / run.distanceMiles
}

export const formatPace = (run: Run): string => formatRunDuration(getPaceSecondsPerMile(run))

export const getMilesThisMonth = (runs: Run[]): number => {
  const now = new Date()

  return runs
    .filter(run => {
      const runDate = new Date(run.date)

      return runDate.getMonth() === now.getMonth() && runDate.getFullYear() === now.getFullYear()
    })
    .reduce((total, run) => total + run.distanceMiles, 0)
}

export const daysAgo = (days: number): number => Date.now() - days * ONE_DAY_MS

// --- Formatting helpers for the live/GPS run flow (operate on RunStats'
// meters/ms/m-per-s/sec-per-km units from runMath.ts, rather than the Run
// summary shape's miles/seconds above) ---

export const METERS_PER_MILE = 1609.34
const SECONDS_PER_KM_TO_SECONDS_PER_MILE = 1.609344
const METERS_PER_SECOND_TO_MPH = 2.2369362920544

export const metersToMiles = (meters: number): number => meters / METERS_PER_MILE

/** Distance in miles, 2 decimal places, e.g. "3.14". */
export const formatDistanceMiles = (meters: number): string => metersToMiles(meters).toFixed(2)

/** Elapsed time formatted the same way as `formatRunDuration` (MM:SS), from a millisecond duration. */
export const formatElapsedTime = (ms: number): string => formatRunDuration(Math.max(0, ms) / 1000)

/** Pace formatted as MM:SS per mile from a seconds-per-km value (runMath's unit). Returns '--:--' when there's no meaningful pace yet. */
export const formatPaceFromSecPerKm = (secPerKm: number): string => {
  if (!secPerKm || secPerKm <= 0 || !isFinite(secPerKm)) {
    return '--:--'
  }

  return formatRunDuration(secPerKm * SECONDS_PER_KM_TO_SECONDS_PER_MILE)
}

/** Speed in mph, 1 decimal place, from a meters-per-second value (runMath's unit). */
export const formatSpeedMph = (metersPerSecond: number): string =>
  (metersPerSecond * METERS_PER_SECOND_TO_MPH).toFixed(1)

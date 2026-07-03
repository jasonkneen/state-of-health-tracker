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

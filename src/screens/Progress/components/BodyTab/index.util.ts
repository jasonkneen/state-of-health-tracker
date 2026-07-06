import {WeighIn} from '@data/models/WeighIn'
import {getTimeOfDayForHour, TimeOfDay} from '@utility/TimeOfDayUtility'

import {LineChartPoint} from '@components/MiniLineChart'

export interface WeightDelta {
  lbs: number
  weeks: number
}

export interface WeighInRow {
  weighIn: WeighIn
  deltaFromPrevious: number | null
}

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

export const roundToTenth = (value: number): number => Math.round(value * 10) / 10

export const buildWeightTrend = (weighIns: WeighIn[]): LineChartPoint[] =>
  [...weighIns]
    .sort((a, b) => a.loggedAt.localeCompare(b.loggedAt))
    .map(weighIn => ({date: weighIn.loggedAt, value: weighIn.weight}))

export const getWeightDelta = (trend: LineChartPoint[]): WeightDelta | null => {
  if (trend.length < 2) return null

  const first = trend[0]
  const last = trend[trend.length - 1]
  const spanMs = new Date(last.date).getTime() - new Date(first.date).getTime()

  return {
    lbs: roundToTenth(last.value - first.value),
    weeks: Math.max(1, Math.round(spanMs / ONE_WEEK_MS))
  }
}

export const formatWeightValue = (weight: number): string => {
  const rounded = roundToTenth(weight)

  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1)
}

export const formatListWeight = (weight: number): string => roundToTenth(weight).toFixed(1)

export const formatSignedDelta = (value: number): string => {
  const rounded = roundToTenth(value)
  const sign = rounded > 0 ? '+' : rounded < 0 ? '-' : ''

  return `${sign}${Math.abs(rounded).toFixed(1)}`
}

export const getTimeOfDay = (isoDate: string): TimeOfDay => getTimeOfDayForHour(new Date(isoDate).getHours())

export const buildWeighInRows = (weighIns: WeighIn[]): WeighInRow[] => {
  const sorted = [...weighIns].sort((a, b) => b.loggedAt.localeCompare(a.loggedAt))

  return sorted.map((weighIn, index) => {
    const previous = sorted[index + 1]

    return {
      weighIn,
      deltaFromPrevious: previous ? roundToTenth(weighIn.weight - previous.weight) : null
    }
  })
}

export const isDeltaTowardGoal = (deltaLbs: number, currentWeight: number, goalWeight: number | null): boolean => {
  if (goalWeight === null) return deltaLbs <= 0

  return goalWeight <= currentWeight ? deltaLbs <= 0 : deltaLbs >= 0
}

export const getToGoLbs = (currentWeight: number, goalWeight: number | null): number | null =>
  goalWeight === null ? null : roundToTenth(Math.abs(currentWeight - goalWeight))

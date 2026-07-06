import {decodeRoutePolyline, RunRecord} from '@data/models/RunRecord'
import {formatDistanceMiles, formatPaceFromSecPerKm, formatRunDuration, formatSpeedMph} from '@utility/RunUtility'
import {format} from 'date-fns'

import type {MapPoint} from '@components/RunMapView'

import {
  RUN_STAT_AVG_PACE_LABEL,
  RUN_STAT_CAL_LABEL,
  RUN_STAT_CALORIES_LABEL,
  RUN_STAT_MPH_UNIT,
  RUN_STAT_PACE_UNIT,
  RUN_SUMMARY_OVERLINE,
  RUN_SUMMARY_SPEED_LABEL,
  RUN_SUMMARY_TIME_LABEL,
  stringWithParameters
} from '@constants/strings'

export interface RunSummaryTile {
  label: string
  value: string
  unit?: string
}

export const buildRunSummaryTiles = (record: RunRecord): RunSummaryTile[] => {
  const avgSpeedMetersPerSecond = record.durationSeconds > 0 ? record.distanceMeters / record.durationSeconds : 0

  return [
    {label: RUN_SUMMARY_TIME_LABEL, value: formatRunDuration(record.durationSeconds)},
    {
      label: RUN_STAT_AVG_PACE_LABEL,
      value: formatPaceFromSecPerKm(record.avgPaceSecPerKm ?? 0),
      unit: RUN_STAT_PACE_UNIT
    },
    {label: RUN_SUMMARY_SPEED_LABEL, value: formatSpeedMph(avgSpeedMetersPerSecond), unit: RUN_STAT_MPH_UNIT},
    {label: RUN_STAT_CALORIES_LABEL, value: `${Math.round(record.calories ?? 0)}`, unit: RUN_STAT_CAL_LABEL}
  ]
}

export const formatRunHeroDistance = (record: RunRecord): string => formatDistanceMiles(record.distanceMeters)

export const formatRunOverline = (record: RunRecord): string =>
  stringWithParameters(RUN_SUMMARY_OVERLINE, record.runType)

export const formatRunDateLine = (startedAt: string): string => format(new Date(startedAt), "EEEE, MMMM d '·' h:mm a")

export const toRoutePoints = (routePolyline: string | null | undefined): MapPoint[] =>
  decodeRoutePolyline(routePolyline).map(point => ({latitude: point.lat, longitude: point.lng}))

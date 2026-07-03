import {decodeRoutePolyline, RunRecord} from '@data/models/RunRecord'
import {formatDistanceMiles, formatPaceFromSecPerKm, formatRunDuration, formatSpeedMph} from '@utility/RunUtility'

import type {MapPoint} from '@components/RunMapView'

import {
  RUN_STAT_AVG_PACE_LABEL,
  RUN_STAT_CALORIES_LABEL,
  RUN_SUMMARY_DISTANCE_LABEL,
  RUN_SUMMARY_SPEED_LABEL,
  RUN_SUMMARY_TIME_LABEL
} from '@constants/strings'

export interface RunSummaryTile {
  value: string
  label: string
}

export const buildRunSummaryTiles = (record: RunRecord): RunSummaryTile[] => {
  const avgSpeedMetersPerSecond = record.durationSeconds > 0 ? record.distanceMeters / record.durationSeconds : 0

  return [
    {value: formatDistanceMiles(record.distanceMeters), label: RUN_SUMMARY_DISTANCE_LABEL},
    {value: formatRunDuration(record.durationSeconds), label: RUN_SUMMARY_TIME_LABEL},
    {value: formatPaceFromSecPerKm(record.avgPaceSecPerKm ?? 0), label: RUN_STAT_AVG_PACE_LABEL},
    {value: formatSpeedMph(avgSpeedMetersPerSecond), label: RUN_SUMMARY_SPEED_LABEL},
    {value: `${Math.round(record.calories ?? 0)}`, label: RUN_STAT_CALORIES_LABEL}
  ]
}

export const toRoutePoints = (routePolyline: string | null | undefined): MapPoint[] =>
  decodeRoutePolyline(routePolyline).map(point => ({latitude: point.lat, longitude: point.lng}))

import {RunStats} from '@service/run/runMath'
import * as Location from 'expo-location'

import {MapPoint} from '@components/RunMapView'

// Below this, a "run" is almost certainly a mis-tap or a GPS warm-up blip,
// not something worth reviewing/saving.
export const MIN_SAVEABLE_DISTANCE_METERS = 80

export const EMPTY_RUN_STATS: RunStats = {
  distanceMeters: 0,
  durationMs: 0,
  avgSpeedMetersPerSecond: 0,
  avgPaceSecondsPerKm: 0,
  calories: 0
}

export const toMapPoints = (points: Location.LocationObject[]): MapPoint[] =>
  points.map(point => ({latitude: point.coords.latitude, longitude: point.coords.longitude}))

import type {Region} from 'react-native-maps'

// Shared, minimal point shape — decoupled from both Location.LocationObject
// (live tracking) and the decoded {lat,lng} route-polyline points (static
// summary view) so RunMapView serves both RunFlow and RunSummary. Callers map
// their source data into this shape before passing it in.
export type MapPoint = {latitude: number; longitude: number}

const REGION_PADDING_FACTOR = 1.4
const MIN_REGION_DELTA = 0.008

/** Bounding-box region around a route, padded so the polyline never hugs the map edges. */
export const regionFromRoute = (route: MapPoint[]): Region | undefined => {
  if (route.length === 0) {
    return undefined
  }

  let minLat = route[0].latitude
  let maxLat = route[0].latitude
  let minLng = route[0].longitude
  let maxLng = route[0].longitude

  route.forEach(point => {
    minLat = Math.min(minLat, point.latitude)
    maxLat = Math.max(maxLat, point.latitude)
    minLng = Math.min(minLng, point.longitude)
    maxLng = Math.max(maxLng, point.longitude)
  })

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * REGION_PADDING_FACTOR, MIN_REGION_DELTA),
    longitudeDelta: Math.max((maxLng - minLng) * REGION_PADDING_FACTOR, MIN_REGION_DELTA)
  }
}

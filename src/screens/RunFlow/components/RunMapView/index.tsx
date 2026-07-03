import React, {useMemo} from 'react'

import {View} from 'react-native'

import {Theme} from '@styles/theme'
import MapView, {Polyline, PROVIDER_DEFAULT, Region} from 'react-native-maps'

import Text from '@components/Text'

import styles from './index.styled'

// Shared, minimal point shape — decoupled from both Location.LocationObject
// (live tracking) and the decoded {lat,lng} route-polyline points (static
// summary view) so this one component serves both RunFlow and RunSummary.
// Callers map their source data into this shape before passing it in.
export type MapPoint = {latitude: number; longitude: number}

interface Props {
  route: MapPoint[]
  /** Keeps the map following the live position while a run is active. Pass false for a static post-run route view. */
  isLive?: boolean
}

const regionFromRoute = (route: MapPoint[]): Region | undefined => {
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
    latitudeDelta: Math.max((maxLat - minLat) * 1.4, 0.008),
    longitudeDelta: Math.max((maxLng - minLng) * 1.4, 0.008)
  }
}

// Note: the old feature/run branch rendered per-segment speed-colored
// polylines with its own inline Haversine implementation. That duplicated
// runMath.ts (which the plan doc explicitly calls out to consolidate) for a
// cosmetic effect only, so it's dropped here in favor of a single solid
// polyline — distance/speed math lives exclusively in runMath.ts now.
const RunMapView = ({route, isLive = false}: Props) => {
  const region = useMemo(() => regionFromRoute(route), [route])

  if (route.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Start running to see your route</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        region={region}
        showsUserLocation={isLive}
        followsUserLocation={isLive}
        showsMyLocationButton={false}
        showsCompass={false}
        rotateEnabled={false}
        scrollEnabled={!isLive}
        zoomEnabled={!isLive}>
        {route.length >= 2 && (
          <Polyline
            coordinates={route}
            strokeWidth={4}
            strokeColor={Theme.colors.accentGreen}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>
    </View>
  )
}

export default RunMapView

import React, {useMemo} from 'react'

import {View} from 'react-native'

import {Theme} from '@styles/theme'
import MapView, {Polyline, PROVIDER_DEFAULT} from 'react-native-maps'

import Text from '@components/Text'

import {RUN_MAP_EMPTY_TEXT} from '@constants/strings'

import styles from './index.styled'
import {MapPoint, regionFromRoute} from './index.util'

export type {MapPoint} from './index.util'

interface Props {
  route: MapPoint[]
  /** Keeps the map following the live position while a run is active. Pass false for a static post-run route view. */
  isLive?: boolean
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
        <Text style={styles.emptyText}>{RUN_MAP_EMPTY_TEXT}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        // A controlled `region` on the pannable static view would snap the
        // map back on every render, fighting the user's gestures.
        region={isLive ? region : undefined}
        initialRegion={isLive ? undefined : region}
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

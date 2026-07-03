import React from 'react'

import {View} from 'react-native'

import {MaterialCommunityIcons} from '@expo/vector-icons'
import {Theme} from '@styles/theme'

import Text from '@components/Text'

import styles from './index.styled'
import {
  formatDistanceMiles,
  formatElapsedTime,
  formatPaceFromSecPerKm,
  formatSpeedMph
} from '../../../../utility/RunUtility'

interface Props {
  /** Timestamp-derived, ticked by the caller — never a setInterval accumulator (see selectElapsedMs). */
  elapsedMs: number
  distanceMeters: number
  avgPaceSecPerKm: number
  avgSpeedMetersPerSecond: number
  calories: number
  status: 'active' | 'paused'
}

const STAT_ICON_SIZE = 22

// Consumes RunStats (runMath.ts) exclusively — no dependency on the old
// fake session shape. Formatting helpers live in RunUtility.ts so they're
// shared with RunSummary.
const RunStatsDisplay = ({
  elapsedMs,
  distanceMeters,
  avgPaceSecPerKm,
  avgSpeedMetersPerSecond,
  calories,
  status
}: Props) => (
  <View style={styles.container}>
    <View style={styles.mainStatsContainer}>
      <View style={styles.primaryStatContainer}>
        <Text style={styles.primaryStatLabel}>TIME</Text>

        <Text style={styles.primaryStatValue}>{formatElapsedTime(elapsedMs)}</Text>
      </View>

      <View style={styles.primaryStatContainer}>
        <Text style={styles.primaryStatLabel}>DISTANCE</Text>

        <View style={styles.distanceValueRow}>
          <Text style={styles.primaryStatValue}>{formatDistanceMiles(distanceMeters)}</Text>

          <Text style={styles.primaryStatUnit}>mi</Text>
        </View>
      </View>
    </View>

    <View style={styles.secondaryStatsContainer}>
      <View style={styles.statItem}>
        <MaterialCommunityIcons
          name="chart-line"
          size={STAT_ICON_SIZE}
          color={Theme.colors.white}
          style={styles.statIcon}
        />

        <Text style={styles.statLabel}>Avg Pace</Text>

        <Text style={styles.statValue}>{formatPaceFromSecPerKm(avgPaceSecPerKm)}</Text>
      </View>

      <View style={styles.statItem}>
        <MaterialCommunityIcons
          name="speedometer"
          size={STAT_ICON_SIZE}
          color={Theme.colors.white}
          style={styles.statIcon}
        />

        <Text style={styles.statLabel}>Speed</Text>

        <Text style={styles.statValue}>{formatSpeedMph(avgSpeedMetersPerSecond)} mph</Text>
      </View>

      <View style={styles.statItem}>
        <MaterialCommunityIcons name="fire" size={STAT_ICON_SIZE} color={Theme.colors.white} style={styles.statIcon} />

        <Text style={styles.statLabel}>Calories</Text>

        <Text style={styles.statValue}>{Math.round(calories)}</Text>
      </View>
    </View>

    <View style={styles.statusContainer}>
      <View
        style={[
          styles.statusIndicator,
          {backgroundColor: status === 'active' ? Theme.colors.accentGreen : Theme.colors.fireOrange}
        ]}
      />

      <Text style={styles.statusText}>{status === 'active' ? 'Tracking run...' : 'Paused'}</Text>
    </View>
  </View>
)

export default RunStatsDisplay

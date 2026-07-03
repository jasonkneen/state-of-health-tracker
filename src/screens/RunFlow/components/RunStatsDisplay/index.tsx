import React from 'react'

import {View} from 'react-native'

import {MaterialCommunityIcons} from '@expo/vector-icons'
import {Theme} from '@styles/theme'
import {formatDistanceMiles, formatElapsedTime, formatPaceFromSecPerKm, formatSpeedMph} from '@utility/RunUtility'

import Text from '@components/Text'

import {
  RUN_PAUSED_STATUS,
  RUN_STAT_AVG_PACE_LABEL,
  RUN_STAT_CALORIES_LABEL,
  RUN_STAT_DISTANCE_HEADER,
  RUN_STAT_MI_UNIT,
  RUN_STAT_MPH_UNIT,
  RUN_STAT_SPEED_LABEL,
  RUN_STAT_TIME_HEADER,
  RUN_TRACKING_STATUS
} from '@constants/strings'

import styles from './index.styled'

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
        <Text style={styles.primaryStatLabel}>{RUN_STAT_TIME_HEADER}</Text>

        <Text style={styles.primaryStatValue}>{formatElapsedTime(elapsedMs)}</Text>
      </View>

      <View style={styles.primaryStatContainer}>
        <Text style={styles.primaryStatLabel}>{RUN_STAT_DISTANCE_HEADER}</Text>

        <View style={styles.distanceValueRow}>
          <Text style={styles.primaryStatValue}>{formatDistanceMiles(distanceMeters)}</Text>

          <Text style={styles.primaryStatUnit}>{RUN_STAT_MI_UNIT}</Text>
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

        <Text style={styles.statLabel}>{RUN_STAT_AVG_PACE_LABEL}</Text>

        <Text style={styles.statValue}>{formatPaceFromSecPerKm(avgPaceSecPerKm)}</Text>
      </View>

      <View style={styles.statItem}>
        <MaterialCommunityIcons
          name="speedometer"
          size={STAT_ICON_SIZE}
          color={Theme.colors.white}
          style={styles.statIcon}
        />

        <Text style={styles.statLabel}>{RUN_STAT_SPEED_LABEL}</Text>

        <Text style={styles.statValue}>{`${formatSpeedMph(avgSpeedMetersPerSecond)} ${RUN_STAT_MPH_UNIT}`}</Text>
      </View>

      <View style={styles.statItem}>
        <MaterialCommunityIcons name="fire" size={STAT_ICON_SIZE} color={Theme.colors.white} style={styles.statIcon} />

        <Text style={styles.statLabel}>{RUN_STAT_CALORIES_LABEL}</Text>

        <Text style={styles.statValue}>{Math.round(calories)}</Text>
      </View>
    </View>

    <View style={styles.statusContainer}>
      <View style={[styles.statusIndicator, status === 'paused' && styles.statusIndicatorPaused]} />

      <Text style={styles.statusText}>{status === 'active' ? RUN_TRACKING_STATUS : RUN_PAUSED_STATUS}</Text>
    </View>
  </View>
)

export default RunStatsDisplay

import React from 'react'

import {View} from 'react-native'

import {Run} from '@data/models/Run'
import {Theme} from '@styles/theme'
import {formatPace, formatRunDuration} from '@utility/RunUtility'
import Svg, {Defs, Pattern, Rect} from 'react-native-svg'

import Text from '@components/Text'

import {
  RUN_STAT_CAL_LABEL,
  RUN_STAT_MILES_LABEL,
  RUN_STAT_PACE_LABEL,
  RUN_STAT_TIME_LABEL,
  RUNS_BADGE_NOT_BACKED_UP,
  RUNS_LATEST_BADGE,
  RUNS_MAP_PLACEHOLDER
} from '@constants/strings'

import styles from './index.styled'

interface Props {
  run: Run
  pending?: boolean
}

interface Stat {
  value: string
  label: string
}

const STRIPE_SIZE = 20

const LatestRunCard = ({run, pending = false}: Props) => {
  const stats: Stat[] = [
    {value: run.distanceMiles.toFixed(2), label: RUN_STAT_MILES_LABEL},
    {value: formatRunDuration(run.durationSeconds), label: RUN_STAT_TIME_LABEL},
    {value: formatPace(run), label: RUN_STAT_PACE_LABEL},
    {value: run.calories.toString(), label: RUN_STAT_CAL_LABEL}
  ]

  return (
    <View style={styles.card}>
      <View style={styles.mapArea}>
        <Svg style={styles.mapStripes}>
          <Defs>
            <Pattern
              id="route-map-stripes"
              width={STRIPE_SIZE}
              height={STRIPE_SIZE}
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)">
              <Rect width={STRIPE_SIZE / 2} height={STRIPE_SIZE} fill={Theme.colors.tile} />

              <Rect x={STRIPE_SIZE / 2} width={STRIPE_SIZE / 2} height={STRIPE_SIZE} fill={Theme.colors.inset} />
            </Pattern>
          </Defs>

          <Rect width="100%" height="100%" fill="url(#route-map-stripes)" />
        </Svg>

        <Text style={styles.mapLabel}>{RUNS_MAP_PLACEHOLDER}</Text>

        <View style={styles.latestBadge}>
          <Text style={styles.latestBadgeText}>{RUNS_LATEST_BADGE}</Text>
        </View>

        {pending && (
          <View style={[styles.latestBadge, styles.pendingBadge]}>
            <Text style={styles.latestBadgeText}>{RUNS_BADGE_NOT_BACKED_UP}</Text>
          </View>
        )}
      </View>

      <View style={styles.statStrip}>
        {stats.map((stat, index) => (
          <View key={stat.label} style={[styles.statColumn, index > 0 && styles.statColumnDivider]}>
            <Text style={styles.statValue}>{stat.value}</Text>

            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default LatestRunCard

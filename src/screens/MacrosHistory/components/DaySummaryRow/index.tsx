import React from 'react'

import {View} from 'react-native'

import {DailySummary} from '@data/models/DailyMacros'
import {Ionicons} from '@expo/vector-icons'
import {Theme} from '@styles/theme'

import Text from '@components/Text'

import styles from './index.styled'
import {formatDaySubtitle, formatDayTitle, goalDeltaLabel} from '../../index.util'

interface Props {
  day: DailySummary
  goal: number
}

const DaySummaryRow = ({day, goal}: Props) => {
  const delta = goalDeltaLabel(day.calories, goal)

  return (
    <View style={styles.card}>
      <View style={styles.dayColumn}>
        <Text style={styles.dayTitle}>{formatDayTitle(day.date)}</Text>

        <Text style={styles.daySubtitle}>{formatDaySubtitle(day)}</Text>
      </View>

      <View style={styles.caloriesColumn}>
        <Text style={styles.caloriesValue}>{day.calories.toLocaleString()}</Text>

        <Text style={[styles.deltaLabel, delta.isOnGoal && styles.deltaLabelOnGoal]}>{delta.label}</Text>
      </View>

      <Ionicons style={styles.chevron} name="chevron-forward" size={18} color={Theme.colors.textMuted} />
    </View>
  )
}

export default DaySummaryRow

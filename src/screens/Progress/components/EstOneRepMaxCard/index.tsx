import React from 'react'

import {View} from 'react-native'

import {Theme} from '@styles/theme'

import MiniLineChart, {LineChartPoint} from '@components/MiniLineChart'
import Text from '@components/Text'

import {
  PROGRESS_1RM_DELTA_TEXT,
  PROGRESS_1RM_UNIT,
  PROGRESS_EST_1RM_LABEL,
  stringWithParameters
} from '@constants/strings'

import styles from './index.styled'
import {formatDateToMonthDay} from '../../../../utility/DateUtility'
import {OneRepMaxDelta} from '../../../../utility/ExerciseHistoryUtility'

interface Props {
  trend: LineChartPoint[]
  currentValue: number
  delta: OneRepMaxDelta | null
}

const EstOneRepMaxCard = ({trend, currentValue, delta}: Props) => {
  const first = trend[0]
  const last = trend[trend.length - 1]
  const middle = trend[Math.floor(trend.length / 2)]

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{PROGRESS_EST_1RM_LABEL}</Text>

        {delta && (
          <Text style={[styles.delta, delta.change < 0 && styles.deltaNegative]}>
            {delta.change >= 0 ? '▲ ' : '▼ '}

            {stringWithParameters(PROGRESS_1RM_DELTA_TEXT, Math.abs(delta.change).toString(), delta.weeks.toString())}
          </Text>
        )}
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{Math.round(currentValue)}</Text>

        <Text style={styles.unit}>{PROGRESS_1RM_UNIT}</Text>
      </View>

      <View style={styles.chartWrapper}>
        <MiniLineChart points={trend} color={Theme.colors.accentGreen} />
      </View>

      {trend.length > 1 && (
        <View style={styles.axisRow}>
          <Text style={styles.axisLabel}>{formatDateToMonthDay(first.date)}</Text>

          {trend.length > 2 && <Text style={styles.axisLabel}>{formatDateToMonthDay(middle.date)}</Text>}

          <Text style={styles.axisLabel}>{formatDateToMonthDay(last.date)}</Text>
        </View>
      )}
    </View>
  )
}

export default EstOneRepMaxCard

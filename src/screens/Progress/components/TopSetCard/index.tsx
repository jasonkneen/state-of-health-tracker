import React, {useRef, useState} from 'react'

import {View} from 'react-native'

import {useWeightUnitLabel} from '@hooks/userData/useWeightUnitLabel'
import {Theme} from '@styles/theme'
import {formatDateToMonthDay, formatDateToMonthDayName} from '@utility/DateUtility'
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated'

import MiniLineChart from '@components/MiniLineChart'
import Text from '@components/Text'
import TickerText from '@components/TickerText'

import {PROGRESS_TOP_SET_DELTA_TEXT, PROGRESS_TOP_SET_LABEL, stringWithParameters} from '@constants/strings'

import styles from './index.styled'
import {TopSetTrendPoint, TrendDelta} from '../../index.util'

interface Props {
  trend: TopSetTrendPoint[]
  delta: TrendDelta | null
}

const DELTA_FADE_DURATION_MS = 80

const TopSetCard = ({trend, delta}: Props) => {
  const weightUnitLabel = useWeightUnitLabel()
  const [scrubbedPoint, setScrubbedPoint] = useState<TopSetTrendPoint | null>(null)
  const [tickDirection, setTickDirection] = useState<1 | -1>(1)
  const previousIndexRef = useRef(trend.length - 1)

  const first = trend[0]
  const last = trend[trend.length - 1]
  const middle = trend[Math.floor(trend.length / 2)]

  const onScrub = (index: number | null) => {
    const targetIndex = index ?? trend.length - 1

    setTickDirection(targetIndex >= Math.min(previousIndexRef.current, trend.length - 1) ? 1 : -1)
    previousIndexRef.current = targetIndex
    setScrubbedPoint(index === null ? null : (trend[index] ?? null))
  }

  const displayedPoint = scrubbedPoint ?? last

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{PROGRESS_TOP_SET_LABEL}</Text>

        {scrubbedPoint ? (
          <TickerText
            text={formatDateToMonthDayName(scrubbedPoint.date)}
            direction={tickDirection}
            style={styles.scrubDate}
          />
        ) : (
          delta && (
            <Animated.View
              entering={FadeIn.duration(DELTA_FADE_DURATION_MS)}
              exiting={FadeOut.duration(DELTA_FADE_DURATION_MS)}>
              <Text style={[styles.delta, delta.percent < 0 && styles.deltaNegative]}>
                {delta.percent >= 0 ? '▲ ' : '▼ '}

                {stringWithParameters(
                  PROGRESS_TOP_SET_DELTA_TEXT,
                  Math.abs(delta.percent).toString(),
                  delta.weeks.toString()
                )}
              </Text>
            </Animated.View>
          )
        )}
      </View>

      <View style={styles.valueRow}>
        <TickerText text={`${Math.round(displayedPoint.weight)}`} direction={tickDirection} style={styles.value} />

        <Text style={styles.unit}>{weightUnitLabel}</Text>

        <TickerText text={`× ${displayedPoint.reps}`} direction={tickDirection} style={styles.reps} />
      </View>

      <View style={styles.chartWrapper}>
        <MiniLineChart
          points={trend.map(point => ({date: point.date, value: point.score}))}
          color={Theme.colors.accentGreen}
          onScrub={onScrub}
          pointLabel={value => `1RM ${Math.round(value)}`}
        />
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

export default TopSetCard

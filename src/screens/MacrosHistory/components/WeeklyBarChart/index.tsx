import React, {useRef, useState} from 'react'

import {LayoutChangeEvent, View} from 'react-native'

import * as Haptics from 'expo-haptics'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import {runOnJS, useSharedValue} from 'react-native-reanimated'

import Text from '@components/Text'
import TickerText from '@components/TickerText'

import {AVG_CAL_LABEL, GOAL_LABEL_PREFIX, LAST_7_DAYS_HEADER} from '@constants/strings'

import styles, {barHeight, goalLineOffset} from './index.styled'
import {
  averageCalories,
  barHeightPct,
  ChartDay,
  chartMaxCalories,
  clampBarIndex,
  formatScrubDayLabel,
  goalLinePct,
  isNearGoal
} from '../../index.util'

interface Props {
  days: ChartDay[]
  goal: number
}

// Horizontal drags scrub the chart, vertical drags stay with the parent list
const SCRUB_ACTIVATE_DISTANCE = 6
const SCRUB_FAIL_DISTANCE = 12

const WeeklyBarChart = ({days, goal}: Props) => {
  const [chartWidth, setChartWidth] = useState(0)
  const [scrubIndex, setScrubIndex] = useState<number | null>(null)
  const [tickDirection, setTickDirection] = useState<1 | -1>(1)
  const previousIndexRef = useRef(0)
  const activeIndex = useSharedValue(-1)

  const average = averageCalories(days)
  const chartMax = chartMaxCalories(days, goal)
  const dayCount = days.length

  const onLayout = (event: LayoutChangeEvent) => setChartWidth(event.nativeEvent.layout.width)

  const emitScrub = (index: number | null) => {
    if (index !== null) Haptics.selectionAsync()

    const targetIndex = index ?? dayCount - 1

    setTickDirection(targetIndex >= Math.min(previousIndexRef.current, dayCount - 1) ? 1 : -1)
    previousIndexRef.current = targetIndex
    setScrubIndex(index)
  }

  const setIndexFromX = (x: number) => {
    'worklet'

    if (chartWidth <= 0 || dayCount === 0) return

    const index = clampBarIndex(x, chartWidth, dayCount)

    if (index !== activeIndex.value) {
      activeIndex.value = index
      runOnJS(emitScrub)(index)
    }
  }

  const scrubGesture = Gesture.Pan()
    .activeOffsetX([-SCRUB_ACTIVATE_DISTANCE, SCRUB_ACTIVATE_DISTANCE])
    .failOffsetY([-SCRUB_FAIL_DISTANCE, SCRUB_FAIL_DISTANCE])
    .onBegin(event => setIndexFromX(event.x))
    .onUpdate(event => setIndexFromX(event.x))
    .onFinalize(() => {
      activeIndex.value = -1
      runOnJS(emitScrub)(null)
    })

  const scrubbedDay = scrubIndex !== null ? days[scrubIndex] : null

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.overline}>{LAST_7_DAYS_HEADER}</Text>

        <Text style={styles.goalCaption}>{`${GOAL_LABEL_PREFIX} ${goal.toLocaleString()}`}</Text>
      </View>

      <View style={styles.averageRow}>
        <TickerText
          text={(scrubbedDay?.calories ?? average).toLocaleString()}
          direction={tickDirection}
          style={styles.averageValue}
        />

        <TickerText
          text={scrubbedDay ? formatScrubDayLabel(scrubbedDay.dateIso) : AVG_CAL_LABEL}
          direction={tickDirection}
          style={styles.averageLabel}
        />
      </View>

      <GestureDetector gesture={scrubGesture}>
        <View onLayout={onLayout}>
          <View style={styles.chartArea}>
            <View style={[styles.goalLine, goalLineOffset(goalLinePct(goal, chartMax))]} />

            <View style={styles.barsRow}>
              {days.map((day, index) => (
                <View
                  key={day.dateIso}
                  style={[
                    styles.bar,
                    isNearGoal(day.calories, goal) && styles.barNearGoal,
                    day.isToday && styles.barToday,
                    scrubbedDay !== null && (index === scrubIndex ? styles.barScrubbed : styles.barDimmed),
                    barHeight(barHeightPct(day.calories, chartMax))
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.labelsRow}>
            {days.map((day, index) => (
              <Text
                key={day.dateIso}
                style={[
                  styles.dayLabel,
                  day.isToday && styles.dayLabelToday,
                  index === scrubIndex && styles.dayLabelScrubbed
                ]}>
                {day.dayOfMonth}
              </Text>
            ))}
          </View>
        </View>
      </GestureDetector>
    </View>
  )
}

export default WeeklyBarChart

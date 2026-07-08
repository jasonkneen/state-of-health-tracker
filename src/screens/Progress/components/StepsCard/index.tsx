import React, {useRef, useState} from 'react'

import {LayoutChangeEvent, View} from 'react-native'

import {DailySteps} from '@data/models/DailySteps'
import * as Haptics from 'expo-haptics'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {FadeIn, FadeOut, runOnJS, useSharedValue} from 'react-native-reanimated'

import Text from '@components/Text'
import TickerText from '@components/TickerText'

import {
  ACTIVITY_STEP_GOAL_TEXT,
  ACTIVITY_STEPS_SOURCE_TEXT,
  ACTIVITY_VS_AVG_TEXT,
  stringWithParameters
} from '@constants/strings'

import styles, {barHeight, progressFillWidth} from './index.styled'
import {clampBarIndex, computeGoalProgress, computeStepBars, formatDayDate, formatDayLabel} from './index.util'
import {formatCount} from '../../index.util'

interface Props {
  weekSteps: DailySteps[]
  stepGoal: number
  vsAveragePct: number | null
}

const VS_AVG_FADE_DURATION_MS = 80
// Horizontal drags scrub the bars, vertical drags stay with the parent ScrollView
const SCRUB_ACTIVATE_DISTANCE = 6
const SCRUB_FAIL_DISTANCE = 12

const StepsCard = ({weekSteps, stepGoal, vsAveragePct}: Props) => {
  const [width, setWidth] = useState(0)
  const [scrubbedIndex, setScrubbedIndex] = useState<number | null>(null)
  const [tickDirection, setTickDirection] = useState<1 | -1>(1)
  const previousIndexRef = useRef(weekSteps.length - 1)

  const scrubIndex = useSharedValue(-1)

  const stepBars = computeStepBars(weekSteps, stepGoal)
  const barCount = stepBars.length
  const todayIndex = weekSteps.length - 1

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)

  const emitScrub = (index: number | null) => {
    if (index !== null) Haptics.selectionAsync()

    const targetIndex = index ?? todayIndex

    setTickDirection(targetIndex >= Math.min(previousIndexRef.current, todayIndex) ? 1 : -1)
    previousIndexRef.current = targetIndex
    setScrubbedIndex(index)
  }

  const setScrubIndexFromX = (x: number) => {
    'worklet'

    if (barCount === 0 || width === 0) return

    const index = clampBarIndex(x, width, barCount)

    if (index !== scrubIndex.value) {
      scrubIndex.value = index
      runOnJS(emitScrub)(index)
    }
  }

  const scrubGesture = Gesture.Pan()
    .activeOffsetX([-SCRUB_ACTIVATE_DISTANCE, SCRUB_ACTIVATE_DISTANCE])
    .failOffsetY([-SCRUB_FAIL_DISTANCE, SCRUB_FAIL_DISTANCE])
    .onBegin(event => setScrubIndexFromX(event.x))
    .onUpdate(event => setScrubIndexFromX(event.x))
    .onFinalize(() => {
      scrubIndex.value = -1
      runOnJS(emitScrub)(null)
    })

  if (weekSteps.length === 0) return null

  const displayedIndex = scrubbedIndex ?? todayIndex
  const displayedDay = weekSteps[displayedIndex]

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <TickerText
          text={formatDayLabel(displayedDay.date, displayedIndex === todayIndex)}
          direction={tickDirection}
          style={styles.label}
        />

        {scrubbedIndex !== null ? (
          <TickerText text={formatDayDate(displayedDay.date)} direction={tickDirection} style={styles.scrubDate} />
        ) : (
          vsAveragePct !== null && (
            <Animated.View
              entering={FadeIn.duration(VS_AVG_FADE_DURATION_MS)}
              exiting={FadeOut.duration(VS_AVG_FADE_DURATION_MS)}>
              <Text style={[styles.vsAvg, vsAveragePct < 0 && styles.vsAvgBehind]}>
                {(vsAveragePct >= 0 ? '▲ ' : '▼ ') +
                  stringWithParameters(ACTIVITY_VS_AVG_TEXT, Math.abs(vsAveragePct).toString())}
              </Text>
            </Animated.View>
          )
        )}
      </View>

      <View style={styles.valueRow}>
        <TickerText text={formatCount(displayedDay.steps)} direction={tickDirection} style={styles.value} />

        <Text style={styles.unit}>{stringWithParameters(ACTIVITY_STEP_GOAL_TEXT, formatCount(stepGoal))}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, progressFillWidth(computeGoalProgress(displayedDay.steps, stepGoal))]} />
      </View>

      <GestureDetector gesture={scrubGesture}>
        <View style={styles.barsRow} onLayout={onLayout}>
          {stepBars.map((bar, index) => (
            <View key={bar.date} style={styles.barColumn}>
              <View style={styles.barArea}>
                <View
                  style={[
                    styles.bar,
                    bar.hitGoal && styles.barHitGoal,
                    index === displayedIndex && styles.barActive,
                    barHeight(bar.heightPct)
                  ]}
                />
              </View>

              <Text style={[styles.barLabel, index === displayedIndex && styles.barLabelActive]}>{bar.label}</Text>
            </View>
          ))}
        </View>
      </GestureDetector>

      <Text style={styles.sourceText}>{ACTIVITY_STEPS_SOURCE_TEXT}</Text>
    </View>
  )
}

export default StepsCard

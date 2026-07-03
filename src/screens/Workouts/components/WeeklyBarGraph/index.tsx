import React, {useEffect} from 'react'

import {TouchableOpacity, View} from 'react-native'

import {useWeeklyWorkoutSummariesQuery} from '@queries/workouts/useWeeklyWorkoutSummariesQuery'
import useUserData from '@store/userData/useUserData'
import {formatDateToMonthDay, getLast7Mondays} from '@utility/DateUtility'
import Animated, {Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming} from 'react-native-reanimated'

import Text from '@components/Text'

import {stringWithParameters, WEEKLY_TARGET_CAPTION, WEEKLY_WORKOUTS_GRAPH_TITLE} from '@constants/strings'

import styles, {BAR_MAX_HEIGHT} from './index.styled'
import {computeWeeklyBars} from './index.util'

const BAR_RISE_STAGGER_MS = 40
const BAR_RISE_DURATION_MS = 275

interface BarProps {
  height: number
  isCurrentWeek: boolean
  didHitTarget: boolean
  index: number
  isRevealed: boolean
}

const Bar = ({height, isCurrentWeek, didHitTarget, index, isRevealed}: BarProps) => {
  const animatedHeight = useSharedValue(0)

  useEffect(() => {
    if (isRevealed) {
      animatedHeight.value = withDelay(
        index * BAR_RISE_STAGGER_MS,
        withTiming(height, {duration: BAR_RISE_DURATION_MS, easing: Easing.out(Easing.cubic)})
      )
    } else {
      animatedHeight.value = 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values and index are stable references
  }, [isRevealed, height])

  const animatedStyle = useAnimatedStyle(() => ({height: animatedHeight.value}))

  return (
    <Animated.View
      style={[styles.bar, isCurrentWeek && styles.barCurrentWeek, didHitTarget && styles.barHitTarget, animatedStyle]}
    />
  )
}

interface Props {
  isRevealed: boolean
  onTargetPressed: () => void
}

const WeeklyBarGraph = ({isRevealed, onTargetPressed}: Props) => {
  const targetWorkouts = useUserData(state => state.targetWorkouts)
  const {data: weeklySummaries = []} = useWeeklyWorkoutSummariesQuery()

  const targetWorkoutsPerWeek = Math.max(targetWorkouts, 1)
  const weekLabels = getLast7Mondays().map(date => formatDateToMonthDay(date))
  const bars = computeWeeklyBars(weekLabels, weeklySummaries, targetWorkoutsPerWeek, BAR_MAX_HEIGHT)

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.headerRow} activeOpacity={0.5} onPress={onTargetPressed}>
        <Text style={styles.overline}>{WEEKLY_WORKOUTS_GRAPH_TITLE}</Text>

        <Text style={styles.targetCaption}>
          {stringWithParameters(WEEKLY_TARGET_CAPTION, targetWorkoutsPerWeek.toString())}
        </Text>
      </TouchableOpacity>

      <View style={styles.barsRow}>
        {bars.map((bar, index) => (
          <View key={bar.label} style={styles.barColumn}>
            <View style={styles.barArea}>
              {bar.completedWorkouts > 0 && <Text style={styles.countLabel}>{bar.completedWorkouts}</Text>}

              <Bar
                height={bar.barHeight}
                isCurrentWeek={bar.isCurrentWeek}
                didHitTarget={bar.didHitTarget}
                index={index}
                isRevealed={isRevealed}
              />
            </View>

            <Text style={[styles.weekLabel, bar.isCurrentWeek && styles.weekLabelCurrent]}>{bar.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default WeeklyBarGraph

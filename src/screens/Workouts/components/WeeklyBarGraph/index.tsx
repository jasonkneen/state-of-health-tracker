import React, {useEffect} from 'react'

import {TouchableOpacity, View} from 'react-native'

import {useWeeklyWorkoutSummariesQuery} from '@queries/workouts/useWeeklyWorkoutSummariesQuery'
import useUserData from '@store/userData/useUserData'
import Animated, {Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming} from 'react-native-reanimated'

import Text from '@components/Text'

import {stringWithParameters, WEEKLY_TARGET_CAPTION, WEEKLY_WORKOUTS_GRAPH_TITLE} from '@constants/strings'

import styles, {BAR_MAX_HEIGHT} from './index.styled'
import {formatDateToMonthDay, getLast7Mondays} from '../../../../utility/DateUtility'

const BAR_RISE_STAGGER_MS = 80
const BAR_RISE_DURATION_MS = 550
const EMPTY_WEEK_BAR_HEIGHT = 4

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
  const {targetWorkouts} = useUserData()
  const {data: weeklySummaries = []} = useWeeklyWorkoutSummariesQuery()

  const targetWorkoutsPerWeek = Math.max(targetWorkouts, 1)

  const weekWorkoutsCompletedMap: {[label: string]: number} = {}

  weeklySummaries.forEach(summary => {
    weekWorkoutsCompletedMap[summary.startOfWeek] = summary.completedWorkouts
  })

  const weekLabels = getLast7Mondays().map(date => formatDateToMonthDay(date))
  const mostCompletedInAWeek = Math.max(...weekLabels.map(label => weekWorkoutsCompletedMap[label] ?? 0))
  const maxScaleValue = Math.max(mostCompletedInAWeek, targetWorkoutsPerWeek)

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.headerRow} activeOpacity={0.5} onPress={onTargetPressed}>
        <Text style={styles.overline}>{WEEKLY_WORKOUTS_GRAPH_TITLE}</Text>

        <Text style={styles.targetCaption}>
          {stringWithParameters(WEEKLY_TARGET_CAPTION, targetWorkoutsPerWeek.toString())}
        </Text>
      </TouchableOpacity>

      <View style={styles.barsRow}>
        {weekLabels.map((label, index) => {
          const completedWorkouts = weekWorkoutsCompletedMap[label] ?? 0
          const isCurrentWeek = index === weekLabels.length - 1
          const didHitTarget = completedWorkouts >= targetWorkoutsPerWeek
          const barHeight = Math.max((completedWorkouts / maxScaleValue) * BAR_MAX_HEIGHT, EMPTY_WEEK_BAR_HEIGHT)

          return (
            <View key={label} style={styles.barColumn}>
              <View style={styles.barArea}>
                {completedWorkouts > 0 && <Text style={styles.countLabel}>{completedWorkouts}</Text>}

                <Bar
                  height={barHeight}
                  isCurrentWeek={isCurrentWeek}
                  didHitTarget={didHitTarget}
                  index={index}
                  isRevealed={isRevealed}
                />
              </View>

              <Text style={[styles.weekLabel, isCurrentWeek && styles.weekLabelCurrent]}>{label}</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default WeeklyBarGraph

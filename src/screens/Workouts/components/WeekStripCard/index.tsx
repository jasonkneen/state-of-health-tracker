import React, {useEffect, useState} from 'react'

import {TouchableOpacity, View} from 'react-native'

import {useWeeklyWorkoutSummariesQuery} from '@queries/workouts/useWeeklyWorkoutSummariesQuery'
import useUserData from '@store/userData/useUserData'
import {Theme} from '@styles/theme'
import {formatDateToMonthDay, getLast7Mondays} from '@utility/DateUtility'
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'

import TargetWorkoutsModal from '@components/dialog/TargetWorkoutsModal'
import CheckIcon from '@components/icons/CheckIcon'
import ChevronRightIcon from '@components/icons/ChevronRightIcon'
import Text from '@components/Text'

import {stringWithParameters, THIS_WEEK_LABEL, WEEK_PROGRESS_TEXT} from '@constants/strings'

import styles from './index.styled'
import WeeklyBarGraph from '../WeeklyBarGraph'

const REVEAL_DURATION_MS = 175
const MAX_WEEK_CIRCLES = 7

const WeekStripCard = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTargetModalVisible, setIsTargetModalVisible] = useState(false)

  const revealProgress = useSharedValue(0)
  const graphContentHeight = useSharedValue(0)

  const {targetWorkouts} = useUserData()
  const {data: weeklySummaries = []} = useWeeklyWorkoutSummariesQuery()

  const targetWorkoutsPerWeek = Math.max(targetWorkouts, 1)
  const currentWeekLabel = formatDateToMonthDay(getLast7Mondays()[6])
  const completedThisWeek =
    weeklySummaries.find(summary => summary.startOfWeek === currentWeekLabel)?.completedWorkouts ?? 0

  useEffect(() => {
    revealProgress.value = withTiming(isExpanded ? 1 : 0, {
      duration: REVEAL_DURATION_MS,
      easing: Easing.inOut(Easing.cubic)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable references
  }, [isExpanded])

  const revealStyle = useAnimatedStyle(() => ({
    height: revealProgress.value * graphContentHeight.value,
    opacity: revealProgress.value
  }))

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${revealProgress.value * 90}deg`}]
  }))

  const weekCircles = Array.from({length: Math.min(targetWorkoutsPerWeek, MAX_WEEK_CIRCLES)})

  return (
    <>
      <TargetWorkoutsModal isVisible={isTargetModalVisible} onDismissed={() => setIsTargetModalVisible(false)} />

      <View style={styles.card}>
        <TouchableOpacity style={styles.stripRow} activeOpacity={0.7} onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={styles.thisWeekText}>
            {`${THIS_WEEK_LABEL} `}

            <Text style={styles.progressText}>
              {stringWithParameters(WEEK_PROGRESS_TEXT, completedThisWeek.toString(), targetWorkoutsPerWeek.toString())}
            </Text>
          </Text>

          <View style={styles.circlesRow}>
            {weekCircles.map((_, index) =>
              index < completedThisWeek ? (
                <View key={index} style={styles.circleDone}>
                  <CheckIcon color={Theme.colors.white} size={10} strokeWidth={3.4} />
                </View>
              ) : (
                <View key={index} style={styles.circleRemaining} />
              )
            )}

            <Animated.View style={[styles.chevron, chevronStyle]}>
              <ChevronRightIcon color={Theme.colors.textDisabled} />
            </Animated.View>
          </View>
        </TouchableOpacity>

        <Animated.View style={[styles.revealContainer, revealStyle]}>
          {/* Absolutely positioned so it always measures its natural height,
              even while the animated container is collapsed to 0 */}
          <View
            style={styles.measuredContent}
            onLayout={event => {
              graphContentHeight.value = event.nativeEvent.layout.height
            }}>
            <WeeklyBarGraph isRevealed={isExpanded} onTargetPressed={() => setIsTargetModalVisible(true)} />
          </View>
        </Animated.View>
      </View>
    </>
  )
}

export default WeekStripCard

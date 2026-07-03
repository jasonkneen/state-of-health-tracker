import React from 'react'

import {Dimensions, SafeAreaView, View} from 'react-native'

import {useSessionStore} from '@store/session/useSessionStore'
import BorderRadius from '@styles/borderRadius'
import Spacing from '@styles/spacing'

import Skeleton from '@components/Skeleton'
import Text from '@components/Text'

import {WORKOUT_SCREEN_TITLE} from '@constants/strings'

import styles from './index.styled'
import {formatDayMonthDay} from '../../../../utility/DateUtility'

const SET_ROW_HEIGHT = 38
const CHECK_CIRCLE_SIZE = 30
const SET_NUMBER_WIDTH = 20

const fixedRowWidth =
  Spacing.GUTTER * 2 + Spacing.MEDIUM * 2 + SET_NUMBER_WIDTH + CHECK_CIRCLE_SIZE + Spacing.X_SMALL * 3
const setCellWidth = (Dimensions.get('window').width - fixedRowWidth) / 2

const WorkoutsSkeleton = () => {
  const setRow = (key: number) => (
    <View key={key} style={styles.setRow}>
      <Skeleton height={16} width={SET_NUMBER_WIDTH} borderRadius={BorderRadius.SECTION / 2} />

      <Skeleton height={SET_ROW_HEIGHT} width={setCellWidth} borderRadius={BorderRadius.CELL} />

      <Skeleton height={SET_ROW_HEIGHT} width={setCellWidth} borderRadius={BorderRadius.CELL} />

      <Skeleton height={CHECK_CIRCLE_SIZE} width={CHECK_CIRCLE_SIZE} borderRadius={BorderRadius.PILL} />
    </View>
  )

  const exerciseCard = (setCount: number) => (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseCardHeader}>
        <Skeleton height={20} width={160} borderRadius={BorderRadius.SECTION / 2} />

        <Skeleton height={28} width={64} borderRadius={BorderRadius.PILL} />
      </View>

      {Array.from({length: setCount}).map((_, i) => setRow(i))}
    </View>
  )

  return (
    <SafeAreaView>
      <Text style={styles.dateOverline}>{formatDayMonthDay(useSessionStore.getState().sessionStartDate)}</Text>

      <Text style={styles.workoutTitle}>{WORKOUT_SCREEN_TITLE}</Text>

      <View style={styles.weekStripCard}>
        <Skeleton height={14} width={110} borderRadius={BorderRadius.SECTION / 2} />

        <View style={styles.circlesRow}>
          {Array.from({length: 5}).map((_, i) => (
            <Skeleton key={i} height={22} width={22} borderRadius={BorderRadius.PILL} />
          ))}
        </View>
      </View>

      {exerciseCard(3)}

      {exerciseCard(2)}
    </SafeAreaView>
  )
}

export default WorkoutsSkeleton

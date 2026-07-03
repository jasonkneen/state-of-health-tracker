import React from 'react'

import {Dimensions, View} from 'react-native'

import {useSessionStore} from '@store/session/useSessionStore'
import BorderRadius from '@styles/borderRadius'
import Spacing from '@styles/spacing'
import {formatDayMonthDay} from '@utility/DateUtility'
import {SafeAreaView} from 'react-native-safe-area-context'

import Skeleton from '@components/Skeleton'
import Text from '@components/Text'

import {WORKOUT_SCREEN_TITLE} from '@constants/strings'

import styles from './index.styled'

// Mirrors the real section layout: ExerciseSetListItem uses a 34pt set-number
// column, flex-1 input cells, and a 42pt check column inside MEDIUM padding
const SET_NUMBER_COLUMN_WIDTH = 34
const CHECK_COLUMN_WIDTH = 42
const CHECK_CIRCLE_SIZE = 30
const SET_CELL_HEIGHT = 40

const setCellWidth =
  (Dimensions.get('window').width -
    Spacing.GUTTER * 2 -
    Spacing.MEDIUM * 2 -
    SET_NUMBER_COLUMN_WIDTH -
    CHECK_COLUMN_WIDTH -
    Spacing.X_SMALL * 3) /
  2

interface Props {
  readonly dateLabel?: string
}

const WorkoutsSkeleton = ({dateLabel}: Props) => {
  const columnLabelRow = () => (
    <View style={styles.labelRow}>
      <View style={styles.setNumberColumn}>
        <Skeleton height={10} width={24} borderRadius={BorderRadius.SECTION / 2} />
      </View>

      <View style={styles.cellColumn}>
        <Skeleton height={10} width={32} borderRadius={BorderRadius.SECTION / 2} />
      </View>

      <View style={styles.cellColumn}>
        <Skeleton height={10} width={32} borderRadius={BorderRadius.SECTION / 2} />
      </View>

      <View style={styles.checkColumn} />
    </View>
  )

  const setRow = (key: number) => (
    <View key={key} style={styles.setRow}>
      <View style={styles.setNumberColumn}>
        <Skeleton height={14} width={16} borderRadius={BorderRadius.SECTION / 2} />
      </View>

      <Skeleton height={SET_CELL_HEIGHT} width={setCellWidth} borderRadius={BorderRadius.CELL} />

      <Skeleton height={SET_CELL_HEIGHT} width={setCellWidth} borderRadius={BorderRadius.CELL} />

      <View style={styles.checkColumn}>
        <Skeleton height={CHECK_CIRCLE_SIZE} width={CHECK_CIRCLE_SIZE} borderRadius={BorderRadius.PILL} />
      </View>
    </View>
  )

  const exerciseCard = (setCount: number) => (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseCardHeader}>
        <Skeleton height={18} width={170} borderRadius={BorderRadius.SECTION / 2} />

        <Skeleton height={34} width={72} borderRadius={BorderRadius.PILL} />
      </View>

      {columnLabelRow()}

      {Array.from({length: setCount}).map((_, i) => setRow(i))}
    </View>
  )

  return (
    <SafeAreaView>
      <Text style={styles.dateOverline}>
        {dateLabel ?? formatDayMonthDay(useSessionStore.getState().sessionStartDate)}
      </Text>

      <Text style={styles.workoutTitle}>{WORKOUT_SCREEN_TITLE}</Text>

      <View style={styles.weekStripCard}>
        <Skeleton height={14} width={110} borderRadius={BorderRadius.SECTION / 2} />

        <View style={styles.circlesRow}>
          {Array.from({length: 5}).map((_, i) => (
            <Skeleton key={i} height={22} width={22} borderRadius={BorderRadius.PILL} />
          ))}

          <Skeleton height={12} width={12} borderRadius={BorderRadius.SECTION / 2} />
        </View>
      </View>

      {exerciseCard(4)}

      {exerciseCard(3)}
    </SafeAreaView>
  )
}

export default WorkoutsSkeleton

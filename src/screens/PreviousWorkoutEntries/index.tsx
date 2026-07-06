import React from 'react'

import {ActivityIndicator, FlatList, ListRenderItemInfo, TouchableOpacity} from 'react-native'

import {mapLoggingType} from '@data/converters/ExerciseConverter'
import {WorkoutSummary} from '@data/models/WorkoutSummary'
import {Entypo, FontAwesome5, MaterialCommunityIcons} from '@expo/vector-icons'
import {useWeightUnitLabel} from '@hooks/userData/useWeightUnitLabel'
import {useWorkoutSummariesInfiniteQuery} from '@queries/workouts/useWorkoutSummariesInfiniteQuery'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'
import {formatDateUTC} from '@utility/DateUtility'
import {formatSecondsAsDuration} from '@utility/formatSecondsAsDuration'

import Chip from '@components/Chip'
import LoadingOverlay from '@components/LoadingOverlay'
import PreviousEntryListItem, {EmptyState} from '@components/PreviousEntryListItem'
import Screen from '@components/Screen'
import Text from '@components/Text'

import {
  BEST_SET_LABEL,
  EXERCISE_LABEL,
  HISTORY_TITLE,
  PREVIOUS_WORKOUTS_ENTRIES_EMPTY_BODY,
  PREVIOUS_WORKOUTS_ENTRIES_EMPTY_TITLE,
  REPS_LABEL,
  SETS_LABEL,
  TOAST_GENERIC_ERROR
} from '@constants/strings'

import BestSetChip from './components/BestSetChip'
import styles from './index.styled'

const PreviousWorkoutEntries = () => {
  const {data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage} =
    useWorkoutSummariesInfiniteQuery()
  const weightUnitLabel = useWeightUnitLabel()

  const summaries = data?.pages.flatMap(page => page.summaries) ?? []

  if (isError && summaries.length === 0) {
    return (
      <Screen edges={[]}>
        <Text style={styles.title}>{HISTORY_TITLE}</Text>

        <TouchableOpacity style={styles.retryContainer} activeOpacity={0.6} onPress={() => refetch()}>
          <Text style={styles.retryText}>{TOAST_GENERIC_ERROR}</Text>
        </TouchableOpacity>
      </Screen>
    )
  }

  if (!isLoading && summaries.length === 0) {
    return (
      <Screen edges={[]}>
        <Text style={styles.title}>{HISTORY_TITLE}</Text>

        <EmptyState
          icon={
            <MaterialCommunityIcons
              style={styles.icon}
              name="weight-lifter"
              size={230}
              color={Theme.colors.secondary}
            />
          }
          title={PREVIOUS_WORKOUTS_ENTRIES_EMPTY_TITLE}
          body={PREVIOUS_WORKOUTS_ENTRIES_EMPTY_BODY}
        />
      </Screen>
    )
  }

  const renderItem = ({item}: ListRenderItemInfo<WorkoutSummary>) => (
    <PreviousEntryListItem
      column1Label={EXERCISE_LABEL}
      column2Label={BEST_SET_LABEL}
      subItems={item.exercises}
      day={formatDateUTC(item.day)}
      headerChip={
        <>
          {item.totalWeight > 0 && (
            <Chip
              style={styles.chipContainer}
              label={`${item.totalWeight} ${weightUnitLabel}`}
              icon={
                <FontAwesome5
                  name="weight-hanging"
                  size={14}
                  color={Theme.colors.secondaryLighter}
                  style={{
                    marginRight: Spacing.XX_SMALL
                  }}
                />
              }
            />
          )}

          {item.totalBodyweightReps > 0 && (
            <Chip
              style={styles.chipContainer}
              label={`${item.totalBodyweightReps} ${REPS_LABEL}`}
              icon={
                <MaterialCommunityIcons
                  name="weight-lifter"
                  size={14}
                  color={Theme.colors.secondaryLighter}
                  style={{
                    marginRight: Spacing.XX_SMALL
                  }}
                />
              }
            />
          )}

          {item.totalDurationSeconds > 0 && (
            <Chip
              style={styles.chipContainer}
              label={formatSecondsAsDuration(item.totalDurationSeconds)}
              icon={
                <Entypo
                  name="stopwatch"
                  size={14}
                  color={Theme.colors.secondaryLighter}
                  style={{
                    marginRight: Spacing.XX_SMALL
                  }}
                />
              }
            />
          )}
        </>
      }
      getChipForItem={entry => <BestSetChip loggingType={mapLoggingType(entry.loggingType)} bestSet={entry.bestSet} />}
      getTitleForItem={entry => entry.exercise.name}
      getSubtitleForItem={entry => `${entry.setsCompleted.toString()} ${SETS_LABEL}`}
    />
  )

  return (
    <>
      {isLoading && <LoadingOverlay />}

      <Screen edges={[]}>
        <Text style={styles.title}>{HISTORY_TITLE}</Text>

        <FlatList
          style={styles.list}
          showsVerticalScrollIndicator={false}
          data={summaries}
          renderItem={renderItem}
          onEndReachedThreshold={0.75}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage()
            }
          }}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator style={styles.footerSpinner} size="small" color={Theme.colors.textSecondary} />
            ) : null
          }
        />
      </Screen>
    </>
  )
}

export default PreviousWorkoutEntries

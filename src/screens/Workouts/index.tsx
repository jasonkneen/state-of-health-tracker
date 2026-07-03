import React, {useEffect} from 'react'

import {KeyboardAvoidingView, SafeAreaView, SectionList, SectionListRenderItem, View} from 'react-native'

import {DailyExercise} from '@data/models/DailyExercise'
import {ExerciseSet} from '@data/models/ExerciseSet'
import Unique from '@data/models/Unique'
import {Ionicons} from '@expo/vector-icons'
import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {useTemplatesQuery} from '@queries/templates/useTemplatesQuery'
import {useWeeklyWorkoutSummariesQuery} from '@queries/workouts/useWeeklyWorkoutSummariesQuery'
import {useNavigation} from '@react-navigation/native'
import useAuthStore from '@store/auth/useAuthStore'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import {useSessionStore} from '@store/session/useSessionStore'
import {Text, useStyleTheme} from '@theme/Theme'

import LoadingOverlay from '@components/LoadingOverlay'
import {EmptyState} from '@components/PreviousEntryListItem'
import PrimaryButton from '@components/PrimaryButton'
import SecondaryButton from '@components/SecondaryButton'
import {SectionListFooter} from '@components/SectionListHeader'

import Screens from '@constants/Screens'
import {
  ADD_EXERCISE_BUTTON_TEXT,
  DAILY_WORKOUT_TITLE,
  EMPTY_DAILY_WORKOUT_BODY,
  EMPTY_DAILY_WORKOUT_TITLE,
  VIEW_PREVIOUS_WORKOUTS_BUTTON_TEXT,
  YOUR_EXERCISES_HEADER
} from '@constants/Strings'

import ExerciseSectionListHeader from './components/ExerciseSectionListHeader'
import ExerciseSetListItem from './components/ExerciseSetListItem'
import WeeklyWorkoutsGraphModule from './components/WeeklyWorkoutsGraphModule'
import WorkoutsSkeleton from './components/WorkoutsSkeleton'
import styles from './index.styled'
import {Navigation} from '../../navigation/types'
import {formatDayMonthDay} from '../../utility/DateUtility'
import ListSwipeItemManager from '../../utility/ListSwipeItemManager'

interface Section extends Unique {
  dailyExercise: DailyExercise
  data: ExerciseSet[]
}

const listSwipeItemManager = new ListSwipeItemManager()

const WorkoutsScreen = () => {
  const navigation = useNavigation<Navigation>()

  const {userId} = useAuthStore()
  const {initCurrentWorkoutDay, isInitializing, currentWorkoutDay, deleteSet} = useDailyWorkoutEntryStore()
  const {isLoading: isLoadingSummaries} = useWeeklyWorkoutSummariesQuery()
  const {sessionStartDate} = useSessionStore()

  // Mounting these warms the cache so Add Exercise opens instantly and the
  // exercises list is persisted for offline use
  useExercisesQuery()
  useTemplatesQuery()

  useEffect(() => {
    initCurrentWorkoutDay(userId)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally run only on mount
  }, [])

  if (isInitializing || isLoadingSummaries) return <WorkoutsSkeleton />

  const dailyExercises = currentWorkoutDay?.dailyExercises ?? []
  const sections: Section[] = dailyExercises.map(dailyExercise => ({
    id: dailyExercise.id,
    dailyExercise,
    data: dailyExercise.sets
  }))

  listSwipeItemManager.setRows(dailyExercises)

  const renderHeader = () => (
    <>
      <Text style={styles.dateText}>{formatDayMonthDay(sessionStartDate)}</Text>

      <Text style={styles.workoutTitle}>{DAILY_WORKOUT_TITLE}</Text>

      <WeeklyWorkoutsGraphModule />

      {isInitializing ? (
        <LoadingOverlay style={styles.loadingIndicator} />
      ) : (
        <>
          <View style={styles.exerciseHeaderContainer}>
            <Text style={styles.exerciseHeaderText}>{YOUR_EXERCISES_HEADER}</Text>

            <SecondaryButton
              style={styles.addButton}
              label={ADD_EXERCISE_BUTTON_TEXT}
              onPress={() => navigation.push(Screens.ADD_EXERCISE)}
            />
          </View>

          {dailyExercises.length === 0 && (
            <EmptyState
              icon={
                <Ionicons style={styles.emptyIcon} name="barbell" size={200} color={useStyleTheme().colors.secondary} />
              }
              title={EMPTY_DAILY_WORKOUT_TITLE}
              body={EMPTY_DAILY_WORKOUT_BODY}
            />
          )}
        </>
      )}
    </>
  )

  const renderFooter = () => (
    <PrimaryButton
      style={styles.footerButton}
      label={VIEW_PREVIOUS_WORKOUTS_BUTTON_TEXT}
      onPress={() => navigation.push(Screens.PREVIOUS_DAILY_EXERCISE_ENTRIES)}
    />
  )

  const renderSectionItemHeader = (dailyExercise: DailyExercise) => (
    <ExerciseSectionListHeader dailyExercise={dailyExercise} dailyExercisesToReorg={dailyExercises} />
  )

  const renderItem: SectionListRenderItem<ExerciseSet, Section> = ({item, section, index}) => (
    <ExerciseSetListItem
      exercise={section.dailyExercise.exercise}
      set={item}
      index={index}
      onDeletePressed={() => deleteSet(section.dailyExercise.exercise, item.id)}
      swipeableRef={ref => listSwipeItemManager.setRef(ref, section, index)}
      onSwipeActivated={() => listSwipeItemManager.closeRow(section, index)}
    />
  )

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="padding">
        <SectionList
          windowSize={3}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="interactive"
          style={styles.sectionList}
          stickySectionHeadersEnabled={false}
          sections={sections}
          ListHeaderComponent={renderHeader()}
          ListFooterComponent={renderFooter()}
          renderItem={renderItem}
          renderSectionHeader={({section}) => renderSectionItemHeader(section.dailyExercise)}
          renderSectionFooter={() => <SectionListFooter />}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default WorkoutsScreen

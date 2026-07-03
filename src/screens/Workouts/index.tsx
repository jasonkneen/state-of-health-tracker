import React, {useEffect, useState} from 'react'

import {
  KeyboardAvoidingView,
  SafeAreaView,
  SectionList,
  SectionListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'

import {DailyExercise} from '@data/models/DailyExercise'
import {ExerciseSet} from '@data/models/ExerciseSet'
import Unique from '@data/models/Unique'
import {AntDesign, Ionicons} from '@expo/vector-icons'
import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {useTemplatesQuery} from '@queries/templates/useTemplatesQuery'
import {useCompleteWorkoutMutation} from '@queries/workouts/useCompleteWorkoutMutation'
import {useWeeklyWorkoutSummariesQuery} from '@queries/workouts/useWeeklyWorkoutSummariesQuery'
import {useNavigation} from '@react-navigation/native'
import useAuthStore from '@store/auth/useAuthStore'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import {useSessionStore} from '@store/session/useSessionStore'
import {Theme} from '@styles/theme'
import * as Haptics from 'expo-haptics'
import Animated, {FadeIn, FadeOut, ZoomIn} from 'react-native-reanimated'

import FloatingActionButton from '@components/FloatingActionButton'
import BarbellIcon from '@components/icons/BarbellIcon'
import CheckIcon from '@components/icons/CheckIcon'
import LoadingOverlay from '@components/LoadingOverlay'
import {EmptyState} from '@components/PreviousEntryListItem'
import PrimaryButton from '@components/PrimaryButton'
import {SectionListFooter} from '@components/SectionListHeader'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import Screens from '@constants/screens'
import {
  ADD_EXERCISE_BUTTON_TEXT,
  COMPLETE_WORKOUT_ERROR,
  EMPTY_DAILY_WORKOUT_BODY,
  EMPTY_DAILY_WORKOUT_TITLE,
  REORGANIZE_HINT_TEXT,
  TOAST_WORKOUT_COMPLETED,
  VIEW_PREVIOUS_WORKOUTS_BUTTON_TEXT,
  WORKOUT_COMPLETED_LABEL,
  WORKOUT_SCREEN_TITLE
} from '@constants/strings'

import CompleteWorkoutPanel from './components/CompleteWorkoutPanel'
import ExerciseSectionListHeader from './components/ExerciseSectionListHeader'
import ExerciseSetListItem from './components/ExerciseSetListItem'
import ReorganizeExerciseList from './components/ReorganizeExerciseList'
import WeekStripCard from './components/WeekStripCard'
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

const CROSS_DISSOLVE_DURATION_MS = 400
const REORG_TRANSITION_DURATION_MS = 200

const WorkoutsScreen = () => {
  const navigation = useNavigation<Navigation>()

  const {userId} = useAuthStore()
  const {initCurrentWorkoutDay, isInitializing, currentWorkoutDay, deleteSet, updateDailyExercises} =
    useDailyWorkoutEntryStore()
  const {mutateAsync: completeWorkout, isPending: isCompletingWorkout} = useCompleteWorkoutMutation()

  const [isReorganizing, setIsReorganizing] = useState(false)
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

  const isLoading = isInitializing || isLoadingSummaries

  const dailyExercises = currentWorkoutDay?.dailyExercises ?? []
  const sections: Section[] = dailyExercises.map(dailyExercise => ({
    id: dailyExercise.id,
    dailyExercise,
    data: dailyExercise.sets
  }))

  listSwipeItemManager.setRows(dailyExercises)

  const onCompleteWorkoutPressed = async () => {
    try {
      await completeWorkout()
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      showToast('success', TOAST_WORKOUT_COMPLETED)
    } catch {
      showToast('error', COMPLETE_WORKOUT_ERROR)
    }
  }

  const renderHeader = () => (
    <>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.dateOverline}>{formatDayMonthDay(sessionStartDate)}</Text>

          <View style={styles.titleRow}>
            <Text style={styles.workoutTitle}>{WORKOUT_SCREEN_TITLE}</Text>

            {!!currentWorkoutDay?.completedAt && (
              <View style={styles.completedChip}>
                <CheckIcon color={Theme.colors.greenOnTint} size={10} strokeWidth={3.4} />

                <Text style={styles.completedChipText}>{WORKOUT_COMPLETED_LABEL}</Text>
              </View>
            )}
          </View>
        </View>

        {!!currentWorkoutDay?.startedAt && !currentWorkoutDay.completedAt && (
          <CompleteWorkoutPanel
            startedAt={currentWorkoutDay.startedAt}
            isCompleting={isCompletingWorkout}
            onCompletePressed={onCompleteWorkoutPressed}
          />
        )}
      </View>

      <WeekStripCard />

      {isInitializing && <LoadingOverlay style={styles.loadingIndicator} />}

      {!isInitializing && dailyExercises.length === 0 && (
        <EmptyState
          icon={
            <View style={styles.emptyIcon}>
              <BarbellIcon size={200} color={Theme.colors.track} />
            </View>
          }
          title={EMPTY_DAILY_WORKOUT_TITLE}
          body={EMPTY_DAILY_WORKOUT_BODY}
        />
      )}
    </>
  )

  const renderFooter = () => (
    <>
      <TouchableOpacity
        style={styles.addExerciseRow}
        activeOpacity={0.6}
        onPress={() => navigation.push(Screens.ADD_EXERCISE)}>
        <AntDesign name="plus" size={16} color={Theme.colors.textSecondary} />

        <Text style={styles.addExerciseText}>{ADD_EXERCISE_BUTTON_TEXT}</Text>
      </TouchableOpacity>

      <PrimaryButton
        style={styles.footerButton}
        label={VIEW_PREVIOUS_WORKOUTS_BUTTON_TEXT}
        onPress={() => navigation.push(Screens.PREVIOUS_DAILY_EXERCISE_ENTRIES)}
      />
    </>
  )

  const startReorganizing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setIsReorganizing(true)
  }

  const finishReorganizing = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setIsReorganizing(false)
  }

  const renderReorganizeHeader = () => (
    <>
      <Text style={styles.dateOverline}>{formatDayMonthDay(sessionStartDate)}</Text>

      <Text style={styles.workoutTitle}>{WORKOUT_SCREEN_TITLE}</Text>

      <Text style={styles.reorganizeHint}>{REORGANIZE_HINT_TEXT}</Text>
    </>
  )

  const renderSectionItemHeader = (dailyExercise: DailyExercise) => (
    <ExerciseSectionListHeader dailyExercise={dailyExercise} onReorganizePressed={startReorganizing} />
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
    <View style={styles.root}>
      {!isLoading && !isReorganizing && (
        <Animated.View style={styles.root} entering={FadeIn.duration(CROSS_DISSOLVE_DURATION_MS)}>
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
        </Animated.View>
      )}

      {!isLoading && isReorganizing && (
        <Animated.View style={styles.root} entering={FadeIn.duration(REORG_TRANSITION_DURATION_MS)}>
          <SafeAreaView style={styles.root}>
            <ReorganizeExerciseList
              dailyExercises={dailyExercises}
              onReorder={updateDailyExercises}
              listHeader={renderReorganizeHeader()}
            />
          </SafeAreaView>

          <Animated.View
            style={styles.fabContainer}
            entering={ZoomIn.duration(REORG_TRANSITION_DURATION_MS).delay(100)}>
            <FloatingActionButton onPress={finishReorganizing}>
              <Ionicons name="checkmark" size={28} color={Theme.colors.onInverse} />
            </FloatingActionButton>
          </Animated.View>
        </Animated.View>
      )}

      {isLoading && (
        <Animated.View style={StyleSheet.absoluteFill} exiting={FadeOut.duration(CROSS_DISSOLVE_DURATION_MS)}>
          <WorkoutsSkeleton />
        </Animated.View>
      )}
    </View>
  )
}

export default WorkoutsScreen

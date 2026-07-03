import React, {useEffect, useRef, useState} from 'react'

import {
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  SectionList,
  SectionListRenderItem,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native'

import {DailyExercise} from '@data/models/DailyExercise'
import {ExerciseSet} from '@data/models/ExerciseSet'
import Unique from '@data/models/Unique'
import {WorkoutDay} from '@data/models/WorkoutDay'
import {AntDesign, Ionicons} from '@expo/vector-icons'
import {Navigation} from '@navigation/types'
import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {useTemplatesQuery} from '@queries/templates/useTemplatesQuery'
import {useCompleteWorkoutMutation} from '@queries/workouts/useCompleteWorkoutMutation'
import {useWeeklyWorkoutSummariesQuery} from '@queries/workouts/useWeeklyWorkoutSummariesQuery'
import {useNavigation} from '@react-navigation/native'
import useAuthStore from '@store/auth/useAuthStore'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import {Theme} from '@styles/theme'
import {compareIsoDateStrings, formatIsoDayMonthDay} from '@utility/DateUtility'
import ListSwipeItemManager from '@utility/ListSwipeItemManager'
import * as Haptics from 'expo-haptics'
import Animated, {FadeIn, FadeOut, ZoomIn} from 'react-native-reanimated'
import {SafeAreaView} from 'react-native-safe-area-context'

import FloatingActionButton from '@components/FloatingActionButton'
import BarbellIcon from '@components/icons/BarbellIcon'
import CheckIcon from '@components/icons/CheckIcon'
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
  EMPTY_PAST_WORKOUT_BODY,
  EMPTY_PAST_WORKOUT_TITLE,
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
import {useWorkoutDayPager} from './hooks/useWorkoutDayPager'
import styles, {pagerPage, pagerPageContent} from './index.styled'

interface Section extends Unique {
  dailyExercise: DailyExercise
  data: ExerciseSet[]
}

const listSwipeItemManager = new ListSwipeItemManager()

const CROSS_DISSOLVE_DURATION_MS = 250
const REORG_TRANSITION_DURATION_MS = 200

const WorkoutsScreen = () => {
  const navigation = useNavigation<Navigation>()
  const {width} = useWindowDimensions()

  const {userId} = useAuthStore()
  const {initCurrentWorkoutDay, isInitializing, currentWorkoutDay, deleteSet, updateDailyExercises} =
    useDailyWorkoutEntryStore()
  const {mutateAsync: completeWorkout, isPending: isCompletingWorkout} = useCompleteWorkoutMutation()
  const {todayIso, yesterdayIso, selectedDateIso, isLoadingDay, previewByDate, selectDay} = useWorkoutDayPager()

  const [isReorganizing, setIsReorganizing] = useState(false)
  const {isLoading: isLoadingSummaries} = useWeeklyWorkoutSummariesQuery()

  // Mounting these warms the cache so Add Exercise opens instantly and the
  // exercises list is persisted for offline use
  useExercisesQuery()
  useTemplatesQuery()

  useEffect(() => {
    initCurrentWorkoutDay(userId)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally run only on mount
  }, [])

  const pagerRef = useRef<ScrollView>(null)

  const isLoading = isInitializing || isLoadingSummaries

  const dailyExercises = currentWorkoutDay?.dailyExercises ?? []

  const onCompleteWorkoutPressed = async () => {
    try {
      await completeWorkout()
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      showToast('success', TOAST_WORKOUT_COMPLETED)
    } catch {
      showToast('error', COMPLETE_WORKOUT_ERROR)
    }
  }

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
      <Text style={styles.dateOverline}>{formatIsoDayMonthDay(selectedDateIso)}</Text>

      <Text style={styles.workoutTitle}>{WORKOUT_SCREEN_TITLE}</Text>

      <Text style={styles.reorganizeHint}>{REORGANIZE_HINT_TEXT}</Text>
    </>
  )

  const renderSectionItemHeader = (dailyExercise: DailyExercise) => (
    <ExerciseSectionListHeader dailyExercise={dailyExercise} onReorganizePressed={startReorganizing} />
  )

  const renderWorkoutDayPage = (workoutDay: WorkoutDay, dateIso: string, isInteractive: boolean) => {
    const isPastDay = !compareIsoDateStrings(dateIso, todayIso)
    const pageDailyExercises = workoutDay.dailyExercises
    const pageSections: Section[] = pageDailyExercises.map(dailyExercise => ({
      id: dailyExercise.id,
      dailyExercise,
      data: dailyExercise.sets
    }))

    // Past days never got a Complete tap on this device (completedAt is
    // local-only), so logged sets are what marks them as completed
    const hasLoggedSets = pageDailyExercises.some(dailyExercise => dailyExercise.sets.some(set => set.completed))
    const isWorkoutCompleted = !!workoutDay.completedAt || (isPastDay && hasLoggedSets)

    // Only the interactive page may own the swipe-row bookkeeping — a preview
    // page registering refs would stomp the focused page's rows
    if (isInteractive) {
      listSwipeItemManager.setRows(pageDailyExercises)
    }

    const renderItem: SectionListRenderItem<ExerciseSet, Section> = ({item, section, index}) => (
      <ExerciseSetListItem
        exercise={section.dailyExercise.exercise}
        set={item}
        index={index}
        onDeletePressed={() => deleteSet(section.dailyExercise.exercise, item.id)}
        swipeableRef={ref => {
          if (isInteractive) {
            listSwipeItemManager.setRef(ref, section, index)
          }
        }}
        onSwipeActivated={() => listSwipeItemManager.closeRow(section, index)}
      />
    )

    const renderHeader = () => (
      <>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.dateOverline}>{formatIsoDayMonthDay(dateIso)}</Text>

            <View style={styles.titleRow}>
              <Text style={styles.workoutTitle}>{WORKOUT_SCREEN_TITLE}</Text>

              {isWorkoutCompleted && (
                <View style={styles.completedChip}>
                  <CheckIcon color={Theme.colors.greenOnTint} size={10} strokeWidth={3.4} />

                  <Text style={styles.completedChipText}>{WORKOUT_COMPLETED_LABEL}</Text>
                </View>
              )}
            </View>
          </View>

          {!isPastDay && !!workoutDay.startedAt && !workoutDay.completedAt && (
            <CompleteWorkoutPanel
              startedAt={workoutDay.startedAt}
              isCompleting={isCompletingWorkout}
              onCompletePressed={onCompleteWorkoutPressed}
            />
          )}

          {isPastDay && (
            <TouchableOpacity style={styles.backToTodayChevron} activeOpacity={0.6} onPress={goToToday}>
              <Ionicons name="chevron-forward" size={24} color={Theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <WeekStripCard />

        {pageDailyExercises.length === 0 && (
          <EmptyState
            icon={
              <View style={styles.emptyIcon}>
                <BarbellIcon size={200} color={Theme.colors.track} />
              </View>
            }
            title={isPastDay ? EMPTY_PAST_WORKOUT_TITLE : EMPTY_DAILY_WORKOUT_TITLE}
            body={isPastDay ? EMPTY_PAST_WORKOUT_BODY : EMPTY_DAILY_WORKOUT_BODY}
          />
        )}
      </>
    )

    return (
      <SafeAreaView edges={['top']}>
        <KeyboardAvoidingView behavior="padding">
          <SectionList
            windowSize={3}
            keyExtractor={item => item.id}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="interactive"
            style={styles.sectionList}
            stickySectionHeadersEnabled={false}
            sections={pageSections}
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

  // Each page renders real content whenever data is available: the store's
  // workout when it holds this page's day, otherwise the prefetched local
  // preview (visible but not interactive). The skeleton only appears on a
  // true local-cache miss, fading out over the fetched content
  const renderPagerPage = (dateIso: string) => {
    const isStoreDay = !!currentWorkoutDay && compareIsoDateStrings(currentWorkoutDay.date, dateIso)
    const isInteractive = isStoreDay && selectedDateIso === dateIso && !isLoadingDay
    const workoutDayForPage = isStoreDay ? currentWorkoutDay : previewByDate[dateIso]

    return (
      <View style={styles.root}>
        {workoutDayForPage && (
          <Animated.View style={pagerPageContent(isInteractive)} entering={FadeIn.duration(CROSS_DISSOLVE_DURATION_MS)}>
            {renderWorkoutDayPage(workoutDayForPage, dateIso, isInteractive)}
          </Animated.View>
        )}

        {!workoutDayForPage && (
          <Animated.View style={StyleSheet.absoluteFill} exiting={FadeOut.duration(CROSS_DISSOLVE_DURATION_MS)}>
            <WorkoutsSkeleton dateLabel={formatIsoDayMonthDay(dateIso)} />
          </Animated.View>
        )}
      </View>
    )
  }

  const onPageSettled = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width)

    selectDay(page === 0 ? yesterdayIso : todayIso)
  }

  // selectDay is called directly because Android doesn't fire
  // onMomentumScrollEnd for programmatic scrolls; on iOS the duplicate call
  // no-ops
  const goToToday = () => {
    pagerRef.current?.scrollTo({x: width, animated: true})
    selectDay(todayIso)
  }

  return (
    <View style={styles.root}>
      {!isLoading && !isReorganizing && (
        <Animated.View style={styles.root} entering={FadeIn.duration(CROSS_DISSOLVE_DURATION_MS)}>
          <ScrollView
            ref={pagerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={!isLoadingDay}
            contentOffset={{x: width, y: 0}}
            onMomentumScrollEnd={onPageSettled}>
            <View style={pagerPage(width)}>{renderPagerPage(yesterdayIso)}</View>

            <View style={pagerPage(width)}>{renderPagerPage(todayIso)}</View>
          </ScrollView>
        </Animated.View>
      )}

      {!isLoading && isReorganizing && (
        <Animated.View style={styles.root} entering={FadeIn.duration(REORG_TRANSITION_DURATION_MS)}>
          <SafeAreaView style={styles.root} edges={['top']}>
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

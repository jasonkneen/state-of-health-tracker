import React, {useEffect} from 'react'

import {View} from 'react-native'

import {ProgressStackParamList} from '@navigation/ProgressStack'
import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {useExerciseHistoryQuery} from '@queries/records/useExerciseHistoryQuery'
import {useRecordsQuery} from '@queries/records/useRecordsQuery'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import useProgressStore from '@store/progress/useProgressStore'

import Text from '@components/Text'

import Screens from '@constants/screens'
import {
  PROGRESS_EMPTY_HISTORY_SUBTITLE,
  PROGRESS_EMPTY_HISTORY_TITLE,
  PROGRESS_NO_EXERCISES_SUBTITLE,
  PROGRESS_NO_EXERCISES_TITLE,
  PROGRESS_NO_WEIGHT_DATA_SUBTITLE
} from '@constants/strings'

import {buildTopSetTrend, getTopSetDelta, groupHistoryIntoSessions} from '../../index.util'
import NewPrCard from '../NewPrCard'
import RecentSessionsList from '../RecentSessionsList'
import SelectedExerciseHeader from '../SelectedExerciseHeader'
import TopSetCard from '../TopSetCard'
import styles from './index.styled'
import {buildPrCard, getDefaultExerciseId} from './index.util'

const ExercisesTab = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProgressStackParamList>>()
  const {data: exercises = []} = useExercisesQuery()
  const {data: records = []} = useRecordsQuery()
  const selectedExerciseId = useProgressStore(state => state.selectedExerciseId)
  const setSelectedExerciseId = useProgressStore(state => state.setSelectedExerciseId)

  const isSelectionValid = exercises.some(exercise => exercise.id === selectedExerciseId)

  // Also re-derives the default when the stored selection points at an
  // exercise that no longer exists
  useEffect(() => {
    if (isSelectionValid || exercises.length === 0) return

    const defaultExerciseId = getDefaultExerciseId(exercises)

    if (defaultExerciseId) setSelectedExerciseId(defaultExerciseId)
  }, [exercises, isSelectionValid, setSelectedExerciseId])

  const {data: history = [], isLoading: isHistoryLoading} = useExerciseHistoryQuery(selectedExerciseId)

  if (exercises.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>{PROGRESS_NO_EXERCISES_TITLE}</Text>

        <Text style={styles.emptySubtitle}>{PROGRESS_NO_EXERCISES_SUBTITLE}</Text>
      </View>
    )
  }

  const sessions = groupHistoryIntoSessions(history)
  const trend = buildTopSetTrend(sessions)
  const delta = getTopSetDelta(trend)

  const prCard = buildPrCard(records, sessions, selectedExerciseId)
  const selectedExercise = exercises.find(exercise => exercise.id === selectedExerciseId)

  const onChangeExercisePressed = () => {
    navigation.navigate(Screens.SELECT_EXERCISE)
  }

  return (
    <View>
      {selectedExercise && (
        <SelectedExerciseHeader exerciseName={selectedExercise.name} onPress={onChangeExercisePressed} />
      )}

      {!!selectedExerciseId && !isHistoryLoading && sessions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{PROGRESS_EMPTY_HISTORY_TITLE}</Text>

          <Text style={styles.emptySubtitle}>{PROGRESS_EMPTY_HISTORY_SUBTITLE}</Text>
        </View>
      )}

      {sessions.length > 0 && trend.length === 0 && (
        <Text style={styles.noteText}>{PROGRESS_NO_WEIGHT_DATA_SUBTITLE}</Text>
      )}

      {trend.length > 0 && <TopSetCard trend={trend} delta={delta} />}

      {prCard && <NewPrCard card={prCard} />}

      {sessions.length > 0 && <RecentSessionsList sessions={sessions} />}
    </View>
  )
}

export default ExercisesTab

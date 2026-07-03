import React, {useEffect, useState} from 'react'

import {View} from 'react-native'

import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {useExerciseHistoryQuery} from '@queries/records/useExerciseHistoryQuery'
import {useRecordsQuery} from '@queries/records/useRecordsQuery'

import Text from '@components/Text'

import {
  PROGRESS_EMPTY_HISTORY_SUBTITLE,
  PROGRESS_EMPTY_HISTORY_TITLE,
  PROGRESS_NO_EXERCISES_SUBTITLE,
  PROGRESS_NO_EXERCISES_TITLE,
  PROGRESS_NO_WEIGHT_DATA_SUBTITLE
} from '@constants/strings'

import {buildTopSetTrend, getTopSetDelta, groupHistoryIntoSessions} from '../../index.util'
import ExerciseChipRow from '../ExerciseChipRow'
import RecentSessionsList from '../RecentSessionsList'
import SessionSummaryCards from '../SessionSummaryCards'
import TopSetCard from '../TopSetCard'
import styles from './index.styled'
import {buildPrCard} from './index.util'

const ExercisesTab = () => {
  const {data: exercises = []} = useExercisesQuery()
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!selectedExerciseId && exercises.length > 0) {
      setSelectedExerciseId(exercises[0].id)
    }
  }, [exercises, selectedExerciseId])

  const {data: history = [], isLoading: isHistoryLoading} = useExerciseHistoryQuery(selectedExerciseId)
  const {data: records = []} = useRecordsQuery()

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

  const latestSession = sessions[0] ?? null
  const prCard = buildPrCard(records, sessions, selectedExerciseId)

  return (
    <View>
      <ExerciseChipRow exercises={exercises} selectedExerciseId={selectedExerciseId} onSelect={setSelectedExerciseId} />

      {!isHistoryLoading && sessions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>{PROGRESS_EMPTY_HISTORY_TITLE}</Text>

          <Text style={styles.emptySubtitle}>{PROGRESS_EMPTY_HISTORY_SUBTITLE}</Text>
        </View>
      )}

      {sessions.length > 0 && trend.length === 0 && (
        <Text style={styles.noteText}>{PROGRESS_NO_WEIGHT_DATA_SUBTITLE}</Text>
      )}

      {trend.length > 0 && <TopSetCard trend={trend} delta={delta} />}

      {latestSession && (
        <SessionSummaryCards
          prCard={prCard}
          lastSessionCard={{
            weight: latestSession.topSet?.weight ?? null,
            reps: latestSession.topSet?.reps ?? null,
            date: latestSession.date,
            setCount: latestSession.setCount
          }}
        />
      )}

      {sessions.length > 0 && <RecentSessionsList sessions={sessions} />}
    </View>
  )
}

export default ExercisesTab

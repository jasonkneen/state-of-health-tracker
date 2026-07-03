import type {PrCardData} from '../NewPrCard'
import {Exercise} from '@data/models/Exercise'
import {PersonalRecord, RecordTypeEnum} from '@data/models/PersonalRecord'

import {SessionSummary} from '../../index.util'

/**
 * Picks the exercise to show by default: the one with the most personal
 * records (the closest available signal for "most set/rep-max data" without
 * fetching every exercise's history), tie-broken by the most recently
 * achieved record. Falls back to the first exercise when no records exist.
 */
export const getDefaultExerciseId = (exercises: Exercise[], records: PersonalRecord[]): string | undefined => {
  if (exercises.length === 0) return undefined

  const statsByExercise = new Map<string, {recordCount: number; latestAchievedAt: string}>()

  records.forEach(record => {
    const stats = statsByExercise.get(record.exerciseId) ?? {recordCount: 0, latestAchievedAt: ''}

    statsByExercise.set(record.exerciseId, {
      recordCount: stats.recordCount + 1,
      latestAchievedAt: record.achievedAt > stats.latestAchievedAt ? record.achievedAt : stats.latestAchievedAt
    })
  })

  let bestExercise: Exercise | null = null
  let bestStats = {recordCount: 0, latestAchievedAt: ''}

  exercises.forEach(exercise => {
    const stats = statsByExercise.get(exercise.id)

    if (!stats) return

    const hasMoreRecords = stats.recordCount > bestStats.recordCount
    const isMoreRecent =
      stats.recordCount === bestStats.recordCount && stats.latestAchievedAt > bestStats.latestAchievedAt

    if (hasMoreRecords || isMoreRecent) {
      bestExercise = exercise
      bestStats = stats
    }
  })

  return (bestExercise ?? exercises[0]).id
}

/**
 * Builds the "new PR" celebration card — only when the exercise's max-weight
 * record was achieved in the latest session. `deltaLbs` compares against the
 * best top set from any earlier session, or null when there is no prior data.
 */
export const buildPrCard = (
  records: PersonalRecord[],
  sessions: SessionSummary[],
  selectedExerciseId: string | undefined
): PrCardData | null => {
  const maxWeightRecord = records.find(
    record => record.exerciseId === selectedExerciseId && record.recordType === RecordTypeEnum.MAX_WEIGHT
  )
  const latestSession = sessions[0] ?? null
  const isNewPR = !!(maxWeightRecord && latestSession && maxWeightRecord.achievedAt.slice(0, 10) === latestSession.date)

  if (!isNewPR || !maxWeightRecord?.repsAtRecord) {
    return null
  }

  const previousBestWeight = sessions
    .filter(session => session.date < latestSession.date)
    .reduce((best, session) => Math.max(best, session.topSet?.weight ?? 0), 0)

  return {
    weight: maxWeightRecord.value,
    reps: maxWeightRecord.repsAtRecord,
    date: maxWeightRecord.achievedAt.slice(0, 10),
    deltaLbs: previousBestWeight > 0 ? Math.round(maxWeightRecord.value - previousBestWeight) : null
  }
}

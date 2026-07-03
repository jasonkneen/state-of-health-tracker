import type {PrCardData} from '../SessionSummaryCards'
import {PersonalRecord, RecordTypeEnum} from '@data/models/PersonalRecord'

import {SessionSummary} from '../../index.util'

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

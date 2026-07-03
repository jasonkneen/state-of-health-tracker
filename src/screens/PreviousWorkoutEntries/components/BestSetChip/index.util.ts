import {LoggingTypeEnum} from '@data/models/Exercise'
import {WorkoutSummaryBestSet} from '@data/models/WorkoutSummary'
import {formatSecondsAsDuration} from '@utility/formatSecondsAsDuration'

import {LBS_LABEL, REPS_LABEL} from '@constants/strings'

export const bestSetLabel = (loggingType: LoggingTypeEnum, bestSet?: WorkoutSummaryBestSet): string => {
  const {weight, addedWeight, reps, durationSeconds} = bestSet ?? {}

  switch (loggingType) {
    case LoggingTypeEnum.BODYWEIGHT_REPS:
      return `${reps ?? 0} ${REPS_LABEL}`
    case LoggingTypeEnum.WEIGHTED_BODYWEIGHT:
      return addedWeight ? `+${addedWeight} ${LBS_LABEL} x ${reps ?? 0}` : `${reps ?? 0} ${REPS_LABEL}`
    case LoggingTypeEnum.TIME_ONLY:
      return formatSecondsAsDuration(durationSeconds ?? 0)
    case LoggingTypeEnum.WEIGHT_TIME:
      return `${weight ?? 0} ${LBS_LABEL} · ${formatSecondsAsDuration(durationSeconds ?? 0)}`
    case LoggingTypeEnum.TIME_REPS:
      return `${formatSecondsAsDuration(durationSeconds ?? 0)} x ${reps ?? 0}`
    case LoggingTypeEnum.WEIGHT_REPS:
    default:
      return `${weight ?? 0} ${LBS_LABEL} x ${reps ?? 0}`
  }
}

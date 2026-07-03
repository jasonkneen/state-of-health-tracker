import React from 'react'

import {LoggingTypeEnum} from '@data/models/Exercise'
import {WorkoutSummaryBestSet} from '@data/models/WorkoutSummary'
import Spacing from '@styles/spacing'

import Chip from '@components/Chip'

import {LBS_LABEL, REPS_LABEL} from '@constants/strings'

import {formatSecondsAsDuration} from '../../../utility/exerciseSetFields'

interface Props {
  loggingType: LoggingTypeEnum
  bestSet?: WorkoutSummaryBestSet
}

const bestSetLabel = (loggingType: LoggingTypeEnum, bestSet?: WorkoutSummaryBestSet): string => {
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

const BestSetChip = (props: Props) => {
  const {loggingType, bestSet} = props

  return (
    <Chip
      label={bestSetLabel(loggingType, bestSet)}
      style={{
        alignSelf: 'flex-end',
        position: 'absolute',
        marginTop: Spacing.X_SMALL,
        marginBottom: Spacing.X_SMALL,
        paddingLeft: Spacing.X_SMALL,
        marginRight: Spacing.X_SMALL,
        top: 0,
        right: 0,
        bottom: 0
      }}
    />
  )
}

export default BestSetChip

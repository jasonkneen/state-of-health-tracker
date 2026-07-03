import React from 'react'

import {LoggingTypeEnum} from '@data/models/Exercise'
import {WorkoutSummaryBestSet} from '@data/models/WorkoutSummary'

import Chip from '@components/Chip'

import styles from './index.styled'
import {bestSetLabel} from './index.util'

interface Props {
  loggingType: LoggingTypeEnum
  bestSet?: WorkoutSummaryBestSet
}

const BestSetChip = ({loggingType, bestSet}: Props) => {
  return <Chip label={bestSetLabel(loggingType, bestSet)} style={styles.chip} />
}

export default BestSetChip

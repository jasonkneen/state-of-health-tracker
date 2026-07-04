import React from 'react'

import {View} from 'react-native'

import {useWeightUnitLabel} from '@hooks/userData/useWeightUnitLabel'
import {formatDateToMonthDay} from '@utility/DateUtility'

import Text from '@components/Text'

import {PROGRESS_NEW_PR_LABEL} from '@constants/strings'

import styles from './index.styled'

export interface PrCardData {
  weight: number
  reps: number
  date: string
  deltaLbs: number | null
}

interface Props {
  card: PrCardData
}

const NewPrCard = ({card}: Props) => {
  const weightUnitLabel = useWeightUnitLabel()

  const caption =
    formatDateToMonthDay(card.date) +
    (card.deltaLbs !== null && card.deltaLbs > 0 ? ` · +${card.deltaLbs} ${weightUnitLabel}` : '')

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{PROGRESS_NEW_PR_LABEL}</Text>

      <Text style={styles.value}>{`${card.weight} × ${card.reps}`}</Text>

      <Text style={styles.caption}>{caption}</Text>
    </View>
  )
}

export default NewPrCard

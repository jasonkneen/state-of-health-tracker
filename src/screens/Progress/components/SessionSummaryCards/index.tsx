import React from 'react'

import {View} from 'react-native'

import {formatDateToMonthDay} from '@utility/DateUtility'

import Text from '@components/Text'

import {PROGRESS_LAST_SESSION_LABEL, PROGRESS_NEW_PR_LABEL} from '@constants/strings'

import styles from './index.styled'

export interface PrCardData {
  weight: number
  reps: number
  date: string
  deltaLbs: number | null
}

export interface LastSessionCardData {
  weight: number | null
  reps: number | null
  date: string
  setCount: number
}

interface Props {
  prCard: PrCardData | null
  lastSessionCard: LastSessionCardData
}

const SessionSummaryCards = ({prCard, lastSessionCard}: Props) => {
  const prCaption = prCard
    ? formatDateToMonthDay(prCard.date) +
      (prCard.deltaLbs !== null && prCard.deltaLbs > 0 ? ` · +${prCard.deltaLbs} lbs` : '')
    : ''

  const lastSessionValue =
    lastSessionCard.weight !== null && lastSessionCard.reps !== null
      ? `${lastSessionCard.weight} × ${lastSessionCard.reps}`
      : `${lastSessionCard.setCount} sets`

  const lastSessionCaption = `${formatDateToMonthDay(lastSessionCard.date)} · ${lastSessionCard.setCount} sets`

  return (
    <View style={styles.row}>
      {prCard && (
        <View style={[styles.card, styles.prCard]}>
          <Text style={styles.prLabel}>{PROGRESS_NEW_PR_LABEL}</Text>

          <Text style={styles.prValue}>{`${prCard.weight} × ${prCard.reps}`}</Text>

          <Text style={styles.prCaption}>{prCaption}</Text>
        </View>
      )}

      <View style={[styles.card, !prCard && styles.cardFullWidth]}>
        <Text style={styles.label}>{PROGRESS_LAST_SESSION_LABEL}</Text>

        <Text style={styles.value}>{lastSessionValue}</Text>

        <Text style={styles.caption}>{lastSessionCaption}</Text>
      </View>
    </View>
  )
}

export default SessionSummaryCards

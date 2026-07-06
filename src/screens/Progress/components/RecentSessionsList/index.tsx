import React from 'react'

import {View} from 'react-native'

import {formatDateToMonthDayName} from '@utility/DateUtility'

import Text from '@components/Text'

import {PROGRESS_RECENT_SESSIONS_HEADER} from '@constants/strings'

import styles from './index.styled'
import {SessionSummary} from '../../index.util'

const MAX_SESSIONS_SHOWN = 8

interface Props {
  sessions: SessionSummary[]
}

const RecentSessionsList = ({sessions}: Props) => (
  <View style={styles.container}>
    <Text style={styles.header}>{PROGRESS_RECENT_SESSIONS_HEADER}</Text>

    {sessions.slice(0, MAX_SESSIONS_SHOWN).map(session => (
      <View key={session.date} style={styles.row}>
        <View style={styles.details}>
          <Text style={styles.date}>{formatDateToMonthDayName(session.date)}</Text>

          <Text style={styles.caption}>
            {session.topSet
              ? session.topSet.weight > 0
                ? `Top set ${session.topSet.weight} × ${session.topSet.reps}`
                : `Top set ${session.topSet.reps} reps`
              : `${session.setCount} sets`}

            {session.topSet ? ` · ${session.setCount} sets` : ''}
          </Text>
        </View>

        {session.estimatedOneRepMax !== null && <Text style={styles.oneRepMax}>1RM {session.estimatedOneRepMax}</Text>}
      </View>
    ))}
  </View>
)

export default RecentSessionsList

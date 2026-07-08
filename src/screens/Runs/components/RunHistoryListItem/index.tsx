import React from 'react'

import {View} from 'react-native'

import {Run} from '@data/models/Run'
import {Theme} from '@styles/theme'
import {formatDateToMonthDayName} from '@utility/DateUtility'
import {formatPace, formatRunDuration} from '@utility/RunUtility'

import RunIcon from '@components/icons/RunIcon'
import IconTile from '@components/IconTile'
import Text from '@components/Text'

import {
  RUNS_BADGE_BEST_PACE,
  RUNS_BADGE_LONGEST,
  RUNS_BADGE_NOT_BACKED_UP,
  RUNS_PACE_CAPTION,
  stringWithParameters
} from '@constants/strings'

import styles from './index.styled'

export type RunBadge = 'best-pace' | 'longest' | undefined

interface Props {
  run: Run
  badge?: RunBadge
  pending?: boolean
}

const RUN_TILE_SIZE = 38

const RunHistoryListItem = ({run, badge, pending = false}: Props) => {
  const title = `${run.distanceMiles.toFixed(2)} mi · ${formatRunDuration(run.durationSeconds)}`
  const caption = `${formatDateToMonthDayName(run.date)} · ${stringWithParameters(RUNS_PACE_CAPTION, formatPace(run))}`

  return (
    <View style={styles.row}>
      <IconTile variant="green" size={RUN_TILE_SIZE}>
        <RunIcon color={Theme.colors.accentGreen} size={17} strokeWidth={2.2} />
      </IconTile>

      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.caption}>{caption}</Text>
      </View>

      {pending && <Text style={[styles.badge, styles.badgeDanger]}>{RUNS_BADGE_NOT_BACKED_UP}</Text>}

      {!pending && badge === 'best-pace' && <Text style={styles.badge}>{RUNS_BADGE_BEST_PACE}</Text>}

      {!pending && badge === 'longest' && <Text style={[styles.badge, styles.badgeTeal]}>{RUNS_BADGE_LONGEST}</Text>}
    </View>
  )
}

export default RunHistoryListItem

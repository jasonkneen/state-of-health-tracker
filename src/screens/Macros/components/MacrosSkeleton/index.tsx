import React from 'react'

import {View} from 'react-native'

import BorderRadius from '@styles/borderRadius'

import Skeleton from '@components/Skeleton'
import Text from '@components/Text'

import {MACROS_TITLE} from '@constants/strings'

import styles from './index.styled'

const RING_SIZE = 116
const LABEL_HEIGHT = 12
const TILE_SIZE = 40
const ROW_HEIGHT = 16

interface Props {
  dateLabel: string
}

const MacrosSkeleton = ({dateLabel}: Props) => {
  const macroRow = (key: number) => (
    <View key={key} style={styles.macroRow}>
      <Skeleton height={LABEL_HEIGHT} width={64} borderRadius={BorderRadius.SECTION / 2} />

      <Skeleton height={LABEL_HEIGHT} width={40} borderRadius={BorderRadius.SECTION / 2} />
    </View>
  )

  const mealCard = (key: number, rowCount: number) => (
    <View key={key} style={styles.mealCard}>
      <View style={styles.mealHeaderRow}>
        <Skeleton height={ROW_HEIGHT} width={110} borderRadius={BorderRadius.SECTION / 2} />

        <Skeleton height={28} width={28} borderRadius={BorderRadius.PILL} />
      </View>

      {Array.from({length: rowCount}).map((_, i) => (
        <View key={i} style={styles.mealEntryRow}>
          <Skeleton height={ROW_HEIGHT} width={150} borderRadius={BorderRadius.SECTION / 2} />

          <Skeleton height={ROW_HEIGHT} width={48} borderRadius={BorderRadius.SECTION / 2} />
        </View>
      ))}
    </View>
  )

  return (
    <View>
      <Text style={styles.dateOverline}>{dateLabel}</Text>

      <Text style={styles.screenTitle}>{MACROS_TITLE}</Text>

      <View style={styles.summaryCard}>
        <Skeleton height={RING_SIZE} width={RING_SIZE} borderRadius={BorderRadius.PILL} />

        <View style={styles.macroRows}>{[0, 1, 2].map(macroRow)}</View>
      </View>

      <View style={styles.aiCard}>
        <Skeleton height={TILE_SIZE} width={TILE_SIZE} borderRadius={BorderRadius.TILE} />

        <View style={styles.aiTextColumn}>
          <Skeleton height={ROW_HEIGHT} width={90} borderRadius={BorderRadius.SECTION / 2} />

          <Skeleton
            height={LABEL_HEIGHT}
            width={200}
            borderRadius={BorderRadius.SECTION / 2}
            style={styles.aiSubtitle}
          />
        </View>

        <Skeleton height={TILE_SIZE} width={TILE_SIZE} borderRadius={BorderRadius.TILE} />
      </View>

      {mealCard(0, 2)}

      {mealCard(1, 1)}
    </View>
  )
}

export default MacrosSkeleton

import React from 'react'

import {View} from 'react-native'

import {MacroTotals} from '@data/models/Macros'
import {Theme} from '@styles/theme'
import Svg, {Circle} from 'react-native-svg'

import MacroGramRow from '@components/MacroGramRow'
import Text from '@components/Text'

import {CARBS_LABEL, FAT_LABEL, OVER_TEXT, PROTEIN_LABEL, REMAINING_TEXT} from '@constants/strings'

import styles from './index.styled'
import {calorieBalance, formatCalories, progressFraction, ResolvedMacroTargets} from '../../index.util'

const RING_SIZE = 116
const RING_STROKE_WIDTH = 10

interface Props {
  totals: MacroTotals
  targets: ResolvedMacroTargets
}

const DailySummaryCard = ({totals, targets}: Props) => {
  const radius = (RING_SIZE - RING_STROKE_WIDTH) / 2
  const circumference = 2 * Math.PI * radius
  const fraction = progressFraction(totals.calories, targets.calories)
  const balance = calorieBalance(totals.calories, targets.calories)

  return (
    <View style={styles.card}>
      <View style={styles.ringContainer}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={radius}
            stroke={Theme.colors.track}
            strokeWidth={RING_STROKE_WIDTH}
            fill="none"
          />

          {fraction > 0 && (
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={radius}
              stroke={Theme.colors.accentGreen}
              strokeWidth={RING_STROKE_WIDTH}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={circumference * (1 - fraction)}
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            />
          )}
        </Svg>

        <View style={styles.ringCenter}>
          <Text style={styles.balanceValue}>{formatCalories(balance.amount)}</Text>

          <Text style={[styles.balanceLabel, balance.isOver && styles.balanceLabelOver]}>
            {balance.isOver ? OVER_TEXT : REMAINING_TEXT}
          </Text>
        </View>
      </View>

      <View style={styles.macroRows}>
        <MacroGramRow label={PROTEIN_LABEL} grams={totals.protein} dotColor={Theme.colors.accentGreen} />

        <MacroGramRow label={CARBS_LABEL} grams={totals.carbs} dotColor={Theme.colors.teal} />

        <MacroGramRow label={FAT_LABEL} grams={totals.fat} dotColor={Theme.colors.lime} isLast />
      </View>
    </View>
  )
}

export default DailySummaryCard

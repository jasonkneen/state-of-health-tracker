import React from 'react'

import {View} from 'react-native'

import {Theme} from '@styles/theme'
import Svg, {Circle} from 'react-native-svg'

import Text from '@components/Text'

import styles, {DONUT_SIZE, DONUT_STROKE_WIDTH} from './index.styled'
import {buildDonutSegments, MACRO_LABELS, MacroBreakdownSlice, MacroKey} from '../../index.util'

const RADIUS = (DONUT_SIZE - DONUT_STROKE_WIDTH) / 2

const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export const MACRO_COLORS: Record<MacroKey, string> = {
  protein: Theme.colors.accentGreen,
  carbs: Theme.colors.teal,
  fat: Theme.colors.lime
}

interface Props {
  slices: MacroBreakdownSlice[]
  selectedKey: MacroKey
}

const MacroDonut = ({slices, selectedKey}: Props) => {
  const segments = buildDonutSegments(slices)
  const selected = slices.find(slice => slice.key === selectedKey)

  return (
    <View style={styles.container}>
      <Svg width={DONUT_SIZE} height={DONUT_SIZE}>
        <Circle
          cx={DONUT_SIZE / 2}
          cy={DONUT_SIZE / 2}
          r={RADIUS}
          stroke={Theme.colors.track}
          strokeWidth={DONUT_STROKE_WIDTH}
          fill="none"
        />

        {segments.map(segment => (
          <Circle
            key={segment.key}
            cx={DONUT_SIZE / 2}
            cy={DONUT_SIZE / 2}
            r={RADIUS}
            stroke={MACRO_COLORS[segment.key]}
            strokeWidth={DONUT_STROKE_WIDTH}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${segment.lengthFraction * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={-segment.startFraction * CIRCUMFERENCE}
            transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
          />
        ))}
      </Svg>

      <View style={styles.centerLabel}>
        <Text style={styles.percentText}>{`${selected?.percent ?? 0}%`}</Text>

        <Text style={styles.macroNameText}>{MACRO_LABELS[selectedKey].toLowerCase()}</Text>
      </View>
    </View>
  )
}

export default MacroDonut

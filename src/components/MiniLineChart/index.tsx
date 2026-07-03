import React, {useState} from 'react'

import {LayoutChangeEvent, View} from 'react-native'

import {Theme} from '@styles/theme'
import Svg, {Circle, Path} from 'react-native-svg'

import styles from './index.styled'

export interface LineChartPoint {
  date: string
  value: number
}

interface Props {
  points: LineChartPoint[]
  height?: number
  color?: string
}

const PADDING = 6
const END_DOT_RADIUS = 4

const MiniLineChart = ({points, height = 120, color = Theme.colors.accentGreen}: Props) => {
  const [width, setWidth] = useState(0)

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)

  if (points.length === 0) return <View style={[styles.wrapper, {height}]} onLayout={onLayout} />

  const values = points.map(point => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = points.length > 1 ? (width - PADDING * 2) / (points.length - 1) : 0

  const coords = points.map((point, index) => ({
    x: PADDING + index * stepX,
    y: PADDING + (1 - (point.value - min) / range) * (height - PADDING * 2)
  }))

  const linePath = coords.map((coord, index) => `${index === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`).join(' ')
  const last = coords[coords.length - 1]
  const areaPath = `${linePath} L ${last.x} ${height} L ${coords[0].x} ${height} Z`

  return (
    <View style={[styles.wrapper, {height}]} onLayout={onLayout}>
      {width > 0 && (
        <Svg width={width} height={height}>
          <Path d={areaPath} fill={color} fillOpacity={0.14} />

          <Path
            d={linePath}
            stroke={color}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <Circle cx={last.x} cy={last.y} r={END_DOT_RADIUS} fill={color} />
        </Svg>
      )}
    </View>
  )
}

export default MiniLineChart

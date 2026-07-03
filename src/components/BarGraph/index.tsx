import React from 'react'

import {TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native'

import Text from '@components/Text'

import styles, {barBlock, xAxisContainer, yAxisLabel} from './index.styled'

interface Props {
  readonly barType?: 'solid' | 'increment'
  readonly yAxisLabels: string[]
  readonly xAxisLabels: string[]
  readonly getBarHeightForLabel?: (xAxisLabel: string) => number
  readonly getBarStyleForLabel?: (xAxisLabel: string) => ViewStyle
  readonly getXAxisLabelStyle?: (xAxisLabel: string) => TextStyle
  readonly getNumberOfItemsForLabel?: (xAxisLabel: string) => number
  readonly xAxisLeftMarginMultiplier?: number
  readonly title?: string
  readonly label1?: string
  readonly label2?: string
  readonly onLabelsPressed?: () => void
}

export const BAR_GRAPH_MAX_HEIGHT = 150

const BarGraph = (props: Props) => {
  const {
    getBarHeightForLabel = () => 0,
    getNumberOfItemsForLabel = () => 0,
    getBarStyleForLabel,
    getXAxisLabelStyle,
    barType = 'solid',
    xAxisLabels,
    yAxisLabels,
    xAxisLeftMarginMultiplier = 4,
    title,
    label1,
    label2,
    onLabelsPressed
  } = props

  const yAxisMaxValue = yAxisLabels.length

  const graphHeight = BAR_GRAPH_MAX_HEIGHT
  const rowItemHeight = graphHeight / yAxisMaxValue

  const yAxis = () => (
    <View style={styles.yAxis}>
      {yAxisLabels.map(value => (
        <Text key={value} style={[styles.yAxisLabelText, yAxisLabel(rowItemHeight)]}>
          {value}
        </Text>
      ))}

      <Text style={[styles.yAxisLabelText, yAxisLabel(rowItemHeight)]}>0</Text>
    </View>
  )

  const xAxisBarBlock = (height: number, label: string) => (
    <View style={[styles.barBlockBase, barBlock(height), getBarStyleForLabel?.(label)]} />
  )

  const xAxisBar = (label: string) => {
    const bars = []

    if (barType === 'increment') {
      const incrementItemHeight = graphHeight / yAxisMaxValue - 3

      for (let i = 0; i < getNumberOfItemsForLabel(label); i++) {
        bars.push(xAxisBarBlock(incrementItemHeight, label))
      }
    }

    return (
      <View key={label} style={styles.xAxisBarContainer}>
        {barType === 'solid' && xAxisBarBlock(getBarHeightForLabel(label), label)}

        {barType === 'increment' && bars}

        <Text style={[styles.xAxisLabelText, getXAxisLabelStyle?.(label)]}>{label}</Text>
      </View>
    )
  }

  const xAxis = () => (
    <View style={[styles.xAxisRow, xAxisContainer(graphHeight, xAxisLeftMarginMultiplier)]}>
      {xAxisLabels.map(label => xAxisBar(label))}
    </View>
  )

  const graph = () => (
    <View style={styles.graph}>
      {yAxis()}

      {xAxis()}
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        style={styles.labelsButton}
        activeOpacity={onLabelsPressed ? 0.5 : 1}
        onPress={() => {
          onLabelsPressed?.()
        }}>
        <Text style={styles.label1}>{label1}</Text>

        <Text style={styles.label2}>{label2}</Text>
      </TouchableOpacity>

      {graph()}
    </View>
  )
}

export default BarGraph

import React from 'react'

import {View} from 'react-native'

import Text from '@components/Text'

import styles from './index.styled'

interface Props<T> {
  readonly subItems: T[]
  readonly day: string
  readonly headerChip: React.JSX.Element
  readonly column1Label: string
  readonly column2Label: string
  readonly getChipForItem: (item: T) => React.JSX.Element
  readonly getTitleForItem: (item: T) => string
  readonly getSubtitleForItem: (item: T) => string
}

const PreviousEntryListItem = <T extends object>(props: Props<T>) => {
  const {headerChip, column1Label, column2Label, subItems, day, getChipForItem, getTitleForItem, getSubtitleForItem} =
    props

  return (
    <View key={day} style={styles.container}>
      <Text style={styles.day}>{day}</Text>

      <View style={styles.headerChipRow}>{headerChip}</View>

      <View style={styles.columnLabelRow}>
        <Text style={styles.column1Label}>{column1Label}</Text>

        <Text style={styles.column2Label}>{column2Label}</Text>
      </View>

      {subItems.map((item: T, i) => (
        <View key={i} style={styles.subItem}>
          <Text style={styles.subItemTitle}>{getTitleForItem(item)}</Text>

          <Text style={styles.subItemSubtitle}>{getSubtitleForItem(item)}</Text>

          {getChipForItem(item)}
        </View>
      ))}
    </View>
  )
}

export default PreviousEntryListItem

interface EmptyStateProps {
  icon: React.JSX.Element
  title: string
  body: string
}

export const EmptyState = (props: EmptyStateProps) => {
  const {icon, title, body} = props

  return (
    <>
      {icon}

      <Text style={styles.emptyStateTitle}>{title}</Text>

      <Text style={styles.emptyStateBody}>{body}</Text>
    </>
  )
}

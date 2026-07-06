import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import {EstimateItem} from '@data/models/MacroEstimate'
import {Theme} from '@styles/theme'

import Text from '@components/Text'

import {formatItemSubtitle} from '../../index.util'
import BowlIcon from '../BowlIcon'
import styles from './index.styled'

interface Props {
  item: EstimateItem
  onCaloriePress: () => void
}

const EstimateItemRow = ({item, onCaloriePress}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconTile}>
        <BowlIcon color={Theme.colors.greenOnTint} />
      </View>

      <View style={styles.textColumn}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>

        <Text style={styles.quantity} numberOfLines={1}>
          {formatItemSubtitle(item)}
        </Text>
      </View>

      <TouchableOpacity style={styles.calorieChip} hitSlop={8} onPress={onCaloriePress}>
        <Text style={styles.calorieText}>{item.calories}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EstimateItemRow

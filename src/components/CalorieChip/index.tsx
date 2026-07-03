import React from 'react'

import {StyleProp, ViewStyle} from 'react-native'

import {MaterialCommunityIcons} from '@expo/vector-icons'

import Chip from '@components/Chip'

import {CAL_LABEL} from '@constants/strings'
import {Theme} from '@styles/theme'

import styles from './index.styled'

interface Props {
  calories: number
  style?: StyleProp<ViewStyle>
}

const CalorieChip = (props: Props) => {
  const {calories, style} = props

  const icon = <MaterialCommunityIcons name="fire" size={24} color={Theme.colors.fireOrange} />

  return <Chip label={`${calories.toString()} ${CAL_LABEL}`} icon={icon} style={[styles.container, style]} />
}

export default CalorieChip

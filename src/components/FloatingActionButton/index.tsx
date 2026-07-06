import React from 'react'

import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native'

import styles from './index.styled'

interface Props {
  readonly children: React.ReactNode
  readonly onPress: () => void
  readonly style?: StyleProp<ViewStyle>
}

const FloatingActionButton = (props: Props) => {
  const {children, onPress, style} = props

  return (
    <TouchableOpacity style={[styles.fab, style]} activeOpacity={0.85} onPress={onPress}>
      {children}
    </TouchableOpacity>
  )
}

export default FloatingActionButton

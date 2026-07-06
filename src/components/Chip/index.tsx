import React from 'react'

import {StyleProp, View, ViewStyle} from 'react-native'

import Text from '@components/Text'

import styles from './index.styled'

interface Props {
  label: string
  icon?: React.JSX.Element
  style?: StyleProp<ViewStyle>
}

const Chip = (props: Props) => {
  const {label, icon, style} = props

  return (
    <View style={[styles.container, style]}>
      {icon && icon}

      <Text>{label}</Text>
    </View>
  )
}

export default Chip

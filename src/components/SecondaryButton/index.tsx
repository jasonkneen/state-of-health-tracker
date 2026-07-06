import React from 'react'

import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native'

import {AntDesign} from '@expo/vector-icons'
import {Theme} from '@styles/theme'

import Text from '@components/Text'

import styles from './index.styled'

interface Props {
  label?: string
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

const SecondaryButton = (props: Props) => {
  const {label, onPress, style} = props

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.5}>
      <View style={[styles.inner, style]}>
        <AntDesign name="plus" size={16} color={Theme.colors.accentGreen} />

        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </TouchableOpacity>
  )
}

export default SecondaryButton

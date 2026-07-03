import React from 'react'

import {ActivityIndicator, DimensionValue, StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native'

import {Theme} from '@styles/theme'

import Text from '@components/Text'

import styles, {buttonTouchable} from './index.styled'

interface Props {
  label: string
  isLoading?: boolean
  onPress: () => void
  style?: StyleProp<ViewStyle>
  width?: DimensionValue
}

const PrimaryButton = (props: Props) => {
  const {label, isLoading = false, onPress, style, width = '100%'} = props
  const handlePress = () => {
    if (!isLoading) {
      onPress()
    }
  }

  return (
    <TouchableOpacity style={buttonTouchable(width)} onPress={handlePress} activeOpacity={0.5}>
      <View style={[styles.inner, style]}>
        {isLoading ? (
          <ActivityIndicator size="small" color={Theme.colors.white} />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default PrimaryButton

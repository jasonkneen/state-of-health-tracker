import React from 'react'

import {ActivityIndicator, View, ViewStyle} from 'react-native'

import {Theme} from '@styles/theme'

import styles from './index.styled'

interface Props {
  style?: ViewStyle
}

const LoadingOverlay = (props: Props) => {
  const {style} = props

  return (
    <View style={[styles.overlay, style]}>
      <ActivityIndicator size="large" color={Theme.colors.secondaryLighter} />
    </View>
  )
}

export default LoadingOverlay

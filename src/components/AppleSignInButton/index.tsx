import React from 'react'

import {ActivityIndicator, StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native'

import {Theme} from '@styles/theme'

import AppleIcon from '@components/icons/AppleIcon'
import Text from '@components/Text'

import {AUTH_CONTINUE_WITH_APPLE} from '@constants/strings'

import styles from './index.styled'

interface Props {
  onPress: () => void
  isLoading?: boolean
  style?: StyleProp<ViewStyle>
}

const AppleSignInButton = (props: Props) => {
  const {onPress, isLoading = false, style} = props

  const handlePress = () => {
    if (!isLoading) {
      onPress()
    }
  }

  return (
    <TouchableOpacity style={styles.touchable} onPress={handlePress} activeOpacity={0.5}>
      <View style={[styles.inner, style]}>
        {isLoading ? (
          <ActivityIndicator size="small" color={Theme.colors.white} />
        ) : (
          <>
            <AppleIcon color={Theme.colors.white} />

            <Text style={styles.label}>{AUTH_CONTINUE_WITH_APPLE}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default AppleSignInButton

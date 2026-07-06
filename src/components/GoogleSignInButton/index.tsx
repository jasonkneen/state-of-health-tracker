import React from 'react'

import {ActivityIndicator, StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native'

import {Theme} from '@styles/theme'

import GoogleIcon from '@components/icons/GoogleIcon'
import Text from '@components/Text'

import {AUTH_CONTINUE_WITH_GOOGLE} from '@constants/strings'

import styles from './index.styled'

interface Props {
  onPress: () => void
  isLoading?: boolean
  style?: StyleProp<ViewStyle>
}

const GoogleSignInButton = (props: Props) => {
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
            <GoogleIcon />

            <Text style={styles.label}>{AUTH_CONTINUE_WITH_GOOGLE}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default GoogleSignInButton

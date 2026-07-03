import React from 'react'

import {ActivityIndicator, DimensionValue, StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native'

import Text from '@components/Text'
import {Theme} from '@styles/theme'
import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'

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
    <TouchableOpacity
      style={{
        width,
        zIndex: -1
      }}
      onPress={handlePress}
      activeOpacity={0.5}>
      <View
        style={[
          {
            backgroundColor: Theme.colors.secondary,
            borderRadius: BorderRadius.BUTTON,
            borderColor: Theme.colors.secondaryLighter,
            padding: Spacing.SMALL,
            alignItems: 'center'
          },
          style
        ]}>
        {isLoading ? (
          <ActivityIndicator size="small" color={Theme.colors.secondaryLighter} />
        ) : (
          <Text
            style={{
              fontWeight: '500',
              fontSize: FontSize.H2,
              marginLeft: Spacing.XX_SMALL,
              marginRight: Spacing.XX_SMALL
            }}>
            {label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default PrimaryButton

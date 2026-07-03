import React from 'react'

import {StyleProp, View, ViewStyle} from 'react-native'

import Text from '@components/Text'
import {Theme} from '@styles/theme'
import BorderRadius from '@styles/borderRadius'
import Spacing from '@styles/spacing'

interface Props {
  label: string
  icon?: React.JSX.Element
  style?: StyleProp<ViewStyle>
}

const Chip = (props: Props) => {
  const {label, icon, style} = props

  return (
    <View
      style={[
        {
          borderRadius: BorderRadius.CHIP,
          backgroundColor: Theme.colors.chip,
          padding: Spacing.XX_SMALL,
          paddingRight: Spacing.X_SMALL,
          flexDirection: 'row',
          alignItems: 'center'
        },
        style
      ]}>
      {icon && icon}

      <Text>{label}</Text>
    </View>
  )
}

export default Chip

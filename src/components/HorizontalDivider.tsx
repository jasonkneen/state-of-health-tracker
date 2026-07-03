import React from 'react'

import {View} from 'react-native'

import {useStyleTheme} from '@styles/theme'

const HorizontalDivider = () => (
  <View
    style={{
      height: 1,
      width: '100%',
      backgroundColor: useStyleTheme().colors.border
    }}
  />
)

export default HorizontalDivider

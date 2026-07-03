import React from 'react'

import {View} from 'react-native'

import {Theme} from '@styles/theme'
const HorizontalDivider = () => (
  <View
    style={{
      height: 1,
      width: '100%',
      backgroundColor: Theme.colors.border
    }}
  />
)

export default HorizontalDivider

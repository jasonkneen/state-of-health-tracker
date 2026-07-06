import {StyleSheet, ViewStyle} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import {Theme} from '@styles/theme'

export const tileSize = (size: number): ViewStyle => ({
  width: size,
  height: size
})

export default StyleSheet.create({
  tile: {
    borderRadius: BorderRadius.TILE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  green: {
    backgroundColor: Theme.colors.greenTint
  },
  teal: {
    backgroundColor: Theme.colors.tealTint
  },
  danger: {
    backgroundColor: Theme.colors.dangerTint
  },
  neutral: {
    backgroundColor: Theme.colors.tile
  }
})

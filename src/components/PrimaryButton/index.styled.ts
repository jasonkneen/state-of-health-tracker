import {DimensionValue, StyleSheet, ViewStyle} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export const buttonTouchable = (width: DimensionValue): ViewStyle => ({
  width,
  zIndex: -1
})

export default StyleSheet.create({
  inner: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: BorderRadius.BUTTON,
    borderColor: Theme.colors.secondaryLighter,
    padding: Spacing.SMALL,
    alignItems: 'center'
  },
  label: {
    fontWeight: '500',
    fontSize: FontSize.H2,
    marginLeft: Spacing.XX_SMALL,
    marginRight: Spacing.XX_SMALL
  }
})

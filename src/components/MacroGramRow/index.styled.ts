import {StyleSheet, ViewStyle} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const DOT_SIZE = 8

export const dotFill = (color: string): ViewStyle => ({
  backgroundColor: color
})

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.X_SMALL,
    paddingVertical: Spacing.X_SMALL
  },
  containerDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Theme.colors.hairline
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: BorderRadius.PILL
  },
  label: {
    flex: 1,
    fontSize: FontSize.BODY,
    color: Theme.colors.textSecondary,
    textTransform: 'capitalize'
  },
  grams: {
    fontSize: FontSize.BODY,
    fontWeight: '600'
  }
})

import {StyleSheet, ViewStyle} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'

export const pagerPage = (width: number): ViewStyle => ({
  width
})

export default StyleSheet.create({
  safeArea: {flex: 1},
  header: {
    paddingHorizontal: Spacing.GUTTER
  },
  title: {
    fontSize: FontSize.SCREEN_TITLE,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: Spacing.MEDIUM,
    marginBottom: Spacing.MEDIUM
  },
  pageContent: {
    paddingTop: Spacing.SMALL,
    paddingHorizontal: Spacing.GUTTER,
    paddingBottom: Spacing.X_LARGE
  }
})

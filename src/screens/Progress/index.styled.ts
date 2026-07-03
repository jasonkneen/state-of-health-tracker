import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'

export default StyleSheet.create({
  safeArea: {flex: 1},
  scrollView: {height: '100%'},
  content: {
    paddingHorizontal: Spacing.GUTTER,
    paddingBottom: Spacing.X_LARGE
  },
  title: {
    fontSize: FontSize.SCREEN_TITLE,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: Spacing.MEDIUM,
    marginBottom: Spacing.MEDIUM
  },
  tabContent: {
    marginTop: Spacing.SMALL
  }
})

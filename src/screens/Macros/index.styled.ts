import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Theme.colors.background
  },
  scrollContent: {
    paddingHorizontal: Spacing.GUTTER,
    paddingBottom: Spacing.X_LARGE
  },
  skeletonOverlay: {
    paddingHorizontal: Spacing.GUTTER
  },
  dateOverline: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    color: Theme.colors.accentGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  dateOverlineTouchable: {
    alignSelf: 'flex-start',
    marginTop: Spacing.MEDIUM
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  screenTitle: {
    fontSize: FontSize.SCREEN_TITLE,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: Spacing.XX_SMALL
  },
  historyButton: {
    padding: Spacing.X_SMALL
  },
  summaryCardContainer: {
    marginTop: Spacing.MEDIUM
  },
  aiCardContainer: {
    marginTop: Spacing.SMALL
  },
  mealCardContainer: {
    marginTop: Spacing.SMALL
  },
  retryContainer: {
    alignItems: 'center',
    marginTop: Spacing.X_LARGE,
    padding: Spacing.MEDIUM
  },
  retryText: {
    fontSize: FontSize.PARAGRAPH,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    textAlign: 'center'
  }
})

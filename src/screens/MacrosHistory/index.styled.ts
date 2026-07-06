import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  root: {
    flex: 1
  },
  list: {
    flex: 1
  },
  skeletonOverlay: {
    paddingHorizontal: Spacing.GUTTER
  },
  listContent: {
    paddingHorizontal: Spacing.GUTTER,
    paddingBottom: Spacing.LARGE
  },
  title: {
    fontSize: FontSize.SCREEN_TITLE,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: Theme.colors.text,
    marginTop: Spacing.X_SMALL,
    marginBottom: Spacing.MEDIUM
  },
  sectionHeader: {
    fontSize: FontSize.H3,
    fontWeight: '700',
    color: Theme.colors.text,
    marginTop: Spacing.LARGE,
    marginBottom: Spacing.SMALL
  },
  skeletonRow: {
    marginBottom: Spacing.SMALL
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.X_LARGE
  },
  emptyTitle: {
    fontSize: FontSize.H3,
    fontWeight: '700',
    textAlign: 'center',
    color: Theme.colors.text
  },
  emptySubtitle: {
    fontSize: FontSize.PARAGRAPH,
    textAlign: 'center',
    color: Theme.colors.textMuted,
    marginTop: Spacing.X_SMALL
  },
  footerSpinner: {
    marginVertical: Spacing.MEDIUM
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

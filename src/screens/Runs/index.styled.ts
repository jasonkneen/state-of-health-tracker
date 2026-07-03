import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  scrollView: {
    height: '100%'
  },
  content: {
    paddingHorizontal: Spacing.GUTTER,
    paddingBottom: Spacing.X_LARGE
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: Spacing.MEDIUM
  },
  title: {
    fontSize: FontSize.SCREEN_TITLE,
    fontWeight: '700',
    letterSpacing: -0.4
  },
  monthTotal: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.textSecondary,
    marginBottom: Spacing.XX_SMALL
  },
  historyHeader: {
    fontSize: FontSize.PARAGRAPH,
    fontWeight: '700',
    marginTop: Spacing.MEDIUM,
    marginBottom: Spacing.XX_SMALL
  },
  sectionHeader: {
    fontSize: FontSize.LABEL,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    marginTop: Spacing.MEDIUM,
    marginBottom: Spacing.XX_SMALL
  },
  startRunButton: {
    marginTop: Spacing.MEDIUM
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.X_LARGE * 2,
    rowGap: Spacing.X_SMALL
  },
  emptyTitle: {
    fontSize: FontSize.H2,
    fontWeight: '700'
  },
  emptyText: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textSecondary,
    textAlign: 'center'
  }
})

import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  card: {
    ...Shadow.CARD,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    padding: Spacing.MEDIUM,
    marginTop: Spacing.SMALL
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  delta: {
    fontSize: FontSize.CAPTION,
    fontWeight: '700',
    color: Theme.colors.teal
  },
  deltaAway: {
    color: Theme.colors.textMuted
  },
  scrubDate: {
    fontSize: FontSize.CAPTION,
    fontWeight: '700',
    color: Theme.colors.textMuted
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    columnGap: Spacing.XX_SMALL,
    marginTop: Spacing.XX_SMALL
  },
  value: {
    fontSize: FontSize.STAT_LG,
    fontWeight: '700',
    letterSpacing: -0.5
  },
  unit: {
    fontSize: FontSize.BODY,
    color: Theme.colors.textMuted,
    marginBottom: Spacing.XX_SMALL
  },
  chartWrapper: {
    marginTop: Spacing.MEDIUM
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.XX_SMALL
  },
  axisLabel: {
    fontSize: FontSize.TAB_LABEL,
    color: Theme.colors.textFaint
  },
  axisGoalLabel: {
    fontSize: FontSize.TAB_LABEL,
    fontWeight: '600',
    color: Theme.colors.teal
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: Spacing.SMALL,
    paddingTop: Spacing.SMALL,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.hairline
  },
  footerCell: {
    flex: 1
  },
  footerCellDivided: {
    marginLeft: Spacing.SMALL,
    paddingLeft: Spacing.SMALL,
    borderLeftWidth: 1,
    borderLeftColor: Theme.colors.hairline
  },
  footerValue: {
    fontSize: FontSize.BODY,
    fontWeight: '700',
    marginTop: Spacing.XX_SMALL
  },
  footerValueAccent: {
    color: Theme.colors.teal
  },
  footerUnit: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '400',
    color: Theme.colors.textFaint
  },
  buttonWrapper: {
    marginTop: Spacing.MEDIUM
  },
  sectionHeader: {
    fontSize: FontSize.H3,
    fontWeight: '700',
    marginTop: Spacing.LARGE,
    marginBottom: Spacing.SMALL
  },
  weighInRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.ITEM,
    paddingHorizontal: Spacing.MEDIUM,
    paddingVertical: Spacing.SMALL,
    marginBottom: Spacing.X_SMALL
  },
  weighInWeight: {
    fontSize: FontSize.BODY,
    fontWeight: '600'
  },
  weighInMeta: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted,
    marginTop: Spacing.XX_SMALL
  },
  weighInDelta: {
    fontSize: FontSize.BODY,
    fontWeight: '600',
    color: Theme.colors.teal
  },
  weighInDeltaMuted: {
    color: Theme.colors.textSecondary
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.X_LARGE
  },
  emptyTitle: {
    fontSize: FontSize.H3,
    fontWeight: '600'
  },
  emptySubtitle: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textMuted,
    marginTop: Spacing.X_SMALL,
    textAlign: 'center'
  }
})

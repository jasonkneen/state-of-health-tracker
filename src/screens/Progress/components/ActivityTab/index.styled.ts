import {StyleSheet, ViewStyle} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const SEGMENT_BAR_HEIGHT = 8
const LEGEND_DOT_SIZE = 8

export const segmentFlex = (kcal: number): ViewStyle => ({
  flex: kcal
})

export default StyleSheet.create({
  card: {
    ...Shadow.CARD,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    padding: Spacing.MEDIUM,
    marginTop: Spacing.SMALL
  },
  label: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5
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
  segmentBar: {
    flexDirection: 'row',
    height: SEGMENT_BAR_HEIGHT,
    borderRadius: BorderRadius.PILL,
    overflow: 'hidden',
    columnGap: 2,
    marginTop: Spacing.SMALL
  },
  segment: {
    height: '100%'
  },
  segmentLifts: {
    backgroundColor: Theme.colors.accentGreen
  },
  segmentSteps: {
    backgroundColor: Theme.colors.teal
  },
  segmentRuns: {
    backgroundColor: Theme.colors.lime
  },
  legendRow: {
    flexDirection: 'row',
    columnGap: Spacing.GUTTER,
    marginTop: Spacing.SMALL
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.XX_SMALL
  },
  legendDot: {
    width: LEGEND_DOT_SIZE,
    height: LEGEND_DOT_SIZE,
    borderRadius: BorderRadius.PILL
  },
  legendLabel: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textSecondary
  },
  legendValue: {
    fontWeight: '700',
    color: Theme.colors.text
  },
  targetsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  targetsValues: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.MEDIUM
  },
  targetText: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textSecondary
  },
  targetValue: {
    fontWeight: '700',
    color: Theme.colors.text
  },
  permissionTitle: {
    fontSize: FontSize.H3,
    fontWeight: '600'
  },
  permissionBody: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textMuted,
    marginTop: Spacing.X_SMALL
  },
  permissionButton: {
    marginTop: Spacing.MEDIUM
  },
  sectionHeader: {
    fontSize: FontSize.H3,
    fontWeight: '700',
    marginTop: Spacing.LARGE,
    marginBottom: Spacing.SMALL
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.ITEM,
    paddingHorizontal: Spacing.MEDIUM,
    paddingVertical: Spacing.SMALL,
    marginBottom: Spacing.X_SMALL
  },
  weekRowDay: {
    fontSize: FontSize.BODY,
    fontWeight: '600'
  },
  weekRowMeta: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted,
    marginTop: Spacing.XX_SMALL
  },
  weekRowRight: {
    alignItems: 'flex-end'
  },
  weekRowKcal: {
    fontSize: FontSize.BODY,
    fontWeight: '700'
  },
  emptyWeekText: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.LARGE
  }
})

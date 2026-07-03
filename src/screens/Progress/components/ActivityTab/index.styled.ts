import {StyleSheet, ViewStyle} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export const BAR_MAX_HEIGHT = 72

const EMPTY_BAR_HEIGHT = 4
const PROGRESS_TRACK_HEIGHT = 8
const SEGMENT_BAR_HEIGHT = 8
const LEGEND_DOT_SIZE = 8

export const barHeight = (heightPct: number): ViewStyle => ({
  height: Math.max(heightPct * BAR_MAX_HEIGHT, EMPTY_BAR_HEIGHT)
})

export const progressFillWidth = (progress: number): ViewStyle => ({
  width: `${progress * 100}%`
})

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
  vsAvg: {
    fontSize: FontSize.CAPTION,
    fontWeight: '700',
    color: Theme.colors.accentGreen
  },
  vsAvgBehind: {
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
  progressTrack: {
    height: PROGRESS_TRACK_HEIGHT,
    borderRadius: BorderRadius.PILL,
    backgroundColor: Theme.colors.track,
    marginTop: Spacing.SMALL,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.PILL,
    backgroundColor: Theme.colors.accentGreen
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    columnGap: Spacing.X_SMALL,
    marginTop: Spacing.MEDIUM
  },
  barColumn: {
    flex: 1,
    alignItems: 'center'
  },
  barArea: {
    height: BAR_MAX_HEIGHT,
    width: '100%',
    justifyContent: 'flex-end'
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: BorderRadius.SECTION / 2,
    borderTopRightRadius: BorderRadius.SECTION / 2,
    borderBottomLeftRadius: BorderRadius.SECTION / 4,
    borderBottomRightRadius: BorderRadius.SECTION / 4,
    backgroundColor: Theme.colors.barMuted
  },
  barHitGoal: {
    backgroundColor: Theme.colors.barMid
  },
  barToday: {
    backgroundColor: Theme.colors.barActive
  },
  barLabel: {
    fontSize: FontSize.TAB_LABEL,
    color: Theme.colors.textMuted,
    marginTop: Spacing.X_SMALL
  },
  barLabelToday: {
    color: Theme.colors.accentGreen,
    fontWeight: '600'
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

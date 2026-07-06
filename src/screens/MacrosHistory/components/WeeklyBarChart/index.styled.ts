import {StyleSheet, ViewStyle} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const CHART_AREA_HEIGHT = 112

export const barHeight = (pct: number): ViewStyle => ({
  height: `${pct}%`
})

export const goalLineOffset = (pct: number): ViewStyle => ({
  bottom: `${pct}%`
})

export default StyleSheet.create({
  card: {
    ...Shadow.CARD,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    padding: Spacing.MEDIUM
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  overline: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: Theme.colors.textMuted
  },
  goalCaption: {
    fontSize: FontSize.LABEL,
    fontWeight: '700',
    color: Theme.colors.accentGreen
  },
  averageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    columnGap: Spacing.X_SMALL,
    marginTop: Spacing.XX_SMALL
  },
  averageValue: {
    fontSize: FontSize.STAT_LG,
    fontWeight: '700',
    color: Theme.colors.text
  },
  averageLabel: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textMuted,
    // Optically sits the label on the stat value's baseline under flex-end
    paddingBottom: Spacing.XX_SMALL
  },
  chartArea: {
    height: CHART_AREA_HEIGHT,
    marginTop: Spacing.MEDIUM
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: Theme.colors.dashedBorder
  },
  barsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    columnGap: Spacing.X_SMALL
  },
  bar: {
    flex: 1,
    borderRadius: BorderRadius.TILE,
    backgroundColor: Theme.colors.barMuted
  },
  barNearGoal: {
    backgroundColor: Theme.colors.barMid
  },
  barToday: {
    backgroundColor: Theme.colors.barActive
  },
  barScrubbed: {
    backgroundColor: Theme.colors.barActive
  },
  barDimmed: {
    opacity: 0.45
  },
  labelsRow: {
    flexDirection: 'row',
    columnGap: Spacing.X_SMALL,
    marginTop: Spacing.X_SMALL
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted
  },
  dayLabelToday: {
    fontWeight: '700',
    color: Theme.colors.accentGreen
  },
  dayLabelScrubbed: {
    fontWeight: '700',
    color: Theme.colors.text
  }
})

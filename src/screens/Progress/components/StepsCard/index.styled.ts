import {StyleSheet, ViewStyle} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const BAR_MAX_HEIGHT = 72
const EMPTY_BAR_HEIGHT = 4
const PROGRESS_TRACK_HEIGHT = 8

export const barHeight = (heightPct: number): ViewStyle => ({
  height: Math.max(heightPct * BAR_MAX_HEIGHT, EMPTY_BAR_HEIGHT)
})

export const progressFillWidth = (progress: number): ViewStyle => ({
  width: `${progress * 100}%`
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
  barActive: {
    backgroundColor: Theme.colors.barActive
  },
  barLabel: {
    fontSize: FontSize.TAB_LABEL,
    color: Theme.colors.textMuted,
    marginTop: Spacing.X_SMALL
  },
  barLabelActive: {
    color: Theme.colors.accentGreen,
    fontWeight: '600'
  },
  sourceText: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.SMALL
  }
})

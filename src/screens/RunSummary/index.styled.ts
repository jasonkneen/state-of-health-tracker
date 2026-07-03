import {StyleSheet, ViewStyle} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

// Retint the baked-in green CTA glow so the Discard button doesn't sit on a
// green shadow — mirrors ConfirmModal's confirmButtonBackground helper.
export const confirmButtonBackground = (color: string): ViewStyle => ({
  backgroundColor: color,
  shadowColor: color
})

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.LARGE,
    rowGap: Spacing.MEDIUM
  },
  notFoundText: {
    fontSize: FontSize.H3,
    color: Theme.colors.textSecondary
  },
  scrollContent: {
    padding: Spacing.GUTTER,
    paddingBottom: Spacing.X_LARGE
  },
  mapContainer: {
    height: 240,
    borderRadius: BorderRadius.CARD_LG,
    overflow: 'hidden',
    marginBottom: Spacing.MEDIUM
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.MEDIUM
  },
  dateText: {
    fontSize: FontSize.H2,
    fontWeight: '700'
  },
  timeText: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textSecondary
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  statTile: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.ITEM,
    paddingVertical: Spacing.MEDIUM,
    marginBottom: Spacing.SMALL
  },
  statValue: {
    fontSize: FontSize.STAT,
    fontWeight: '700',
    marginBottom: Spacing.XX_SMALL
  },
  statLabel: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.GUTTER,
    paddingTop: Spacing.SMALL,
    paddingBottom: Spacing.LARGE
  }
})

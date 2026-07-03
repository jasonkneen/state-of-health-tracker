import {StyleSheet, ViewStyle} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const MAP_HEIGHT = 340
const MAP_FADE_HEIGHT = 96
const BACK_BUTTON_SIZE = 40

// Retint the baked-in green CTA glow so the Discard button doesn't sit on a
// green shadow — mirrors ConfirmModal's confirmButtonBackground helper.
export const confirmButtonBackground = (color: string): ViewStyle => ({
  backgroundColor: color,
  shadowColor: color
})

// The map runs edge-to-edge under the status bar, so the floating back
// button offsets itself by the live top inset instead of a SafeAreaView.
export const backButtonPosition = (topInset: number): ViewStyle => ({
  top: topInset + Spacing.X_SMALL
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
    paddingBottom: Spacing.X_LARGE
  },
  mapContainer: {
    height: MAP_HEIGHT
  },
  mapFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: MAP_FADE_HEIGHT
  },
  backButton: {
    position: 'absolute',
    left: Spacing.GUTTER,
    width: BACK_BUTTON_SIZE,
    height: BACK_BUTTON_SIZE,
    borderRadius: BACK_BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.tile
  },
  content: {
    paddingHorizontal: Spacing.GUTTER,
    paddingTop: Spacing.GUTTER
  },
  overline: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.X_SMALL,
    color: Theme.colors.accentGreen
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  heroValue: {
    fontSize: FontSize.STAT_HERO,
    fontWeight: '800'
  },
  heroUnit: {
    fontSize: FontSize.H3,
    fontWeight: '600',
    marginLeft: Spacing.XX_SMALL,
    color: Theme.colors.textSecondary
  },
  dateLine: {
    fontSize: FontSize.PARAGRAPH,
    marginTop: Spacing.XX_SMALL,
    marginBottom: Spacing.LARGE,
    color: Theme.colors.textMuted
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  statTile: {
    width: '48%',
    padding: Spacing.MEDIUM,
    marginBottom: Spacing.SMALL,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.ITEM
  },
  statLabel: {
    fontSize: FontSize.OVERLINE,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing.X_SMALL,
    color: Theme.colors.textMuted
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  statValue: {
    fontSize: FontSize.STAT_LG,
    fontWeight: '700'
  },
  statUnit: {
    fontSize: FontSize.LABEL,
    marginLeft: Spacing.XX_SMALL,
    color: Theme.colors.textSecondary
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.GUTTER,
    paddingTop: Spacing.SMALL,
    paddingBottom: Spacing.LARGE
  }
})

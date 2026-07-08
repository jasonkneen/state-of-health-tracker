import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export const MAP_PLACEHOLDER_HEIGHT = 150

export default StyleSheet.create({
  card: {
    ...Shadow.CARD,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    overflow: 'hidden',
    marginTop: Spacing.SMALL
  },
  mapArea: {
    height: MAP_PLACEHOLDER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapStripes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  mapLabel: {
    fontSize: FontSize.OVERLINE,
    color: Theme.colors.textSecondary,
    backgroundColor: Theme.colors.navBar,
    paddingVertical: Spacing.XX_SMALL,
    paddingHorizontal: Spacing.X_SMALL + 2,
    borderRadius: BorderRadius.SECTION / 2,
    overflow: 'hidden'
  },
  latestBadge: {
    position: 'absolute',
    top: Spacing.SMALL,
    left: Spacing.SMALL,
    backgroundColor: Theme.colors.accentGreen,
    borderRadius: BorderRadius.PILL,
    paddingVertical: Spacing.XX_SMALL + 1,
    paddingHorizontal: Spacing.X_SMALL + 2
  },
  pendingBadge: {
    left: undefined,
    right: Spacing.SMALL,
    backgroundColor: Theme.colors.error
  },
  latestBadgeText: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '700',
    color: Theme.colors.white
  },
  statStrip: {
    flexDirection: 'row',
    paddingVertical: Spacing.MEDIUM,
    paddingHorizontal: Spacing.XX_SMALL
  },
  statColumn: {
    flex: 1,
    alignItems: 'center'
  },
  statColumnDivider: {
    borderLeftWidth: 1,
    borderLeftColor: Theme.colors.grid
  },
  statValue: {
    fontSize: FontSize.STAT,
    fontWeight: '700'
  },
  statLabel: {
    fontSize: FontSize.TAB_LABEL,
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: Spacing.XX_SMALL / 2
  }
})

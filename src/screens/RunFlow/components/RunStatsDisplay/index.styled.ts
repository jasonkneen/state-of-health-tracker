import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.MEDIUM
  },
  mainStatsContainer: {
    marginBottom: Spacing.LARGE
  },
  primaryStatContainer: {
    alignItems: 'center',
    marginBottom: Spacing.LARGE
  },
  primaryStatLabel: {
    fontSize: FontSize.LABEL,
    fontWeight: '600',
    letterSpacing: 1,
    color: Theme.colors.textSecondary,
    marginBottom: Spacing.XX_SMALL
  },
  primaryStatValue: {
    fontSize: 48,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  distanceValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    columnGap: Spacing.XX_SMALL
  },
  primaryStatUnit: {
    fontSize: FontSize.H2,
    fontWeight: '500',
    color: Theme.colors.textSecondary,
    marginBottom: Spacing.X_SMALL
  },
  secondaryStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.X_LARGE
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statIcon: {
    marginBottom: Spacing.X_SMALL
  },
  statLabel: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.textSecondary,
    marginBottom: Spacing.X_SMALL
  },
  statValue: {
    fontSize: FontSize.H3,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.X_SMALL
  },
  statusText: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textSecondary
  }
})

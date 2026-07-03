import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  dateOverline: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    color: Theme.colors.accentGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  screenTitle: {
    fontSize: FontSize.SCREEN_TITLE,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: Spacing.XX_SMALL
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.LARGE,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    padding: Spacing.GUTTER,
    marginTop: Spacing.MEDIUM
  },
  macroRows: {
    flex: 1
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.X_SMALL
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.SMALL,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    padding: Spacing.MEDIUM,
    marginTop: Spacing.SMALL
  },
  aiTextColumn: {
    flex: 1
  },
  aiSubtitle: {
    marginTop: Spacing.X_SMALL
  },
  mealCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    paddingHorizontal: Spacing.MEDIUM,
    paddingVertical: Spacing.SMALL,
    marginTop: Spacing.SMALL
  },
  mealHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.X_SMALL
  },
  mealEntryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.SMALL
  }
})

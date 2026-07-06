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
    marginBottom: Spacing.SMALL
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dayColumn: {
    flex: 1,
    marginRight: Spacing.SMALL
  },
  dayTitle: {
    fontSize: FontSize.H3,
    fontWeight: '700',
    color: Theme.colors.text
  },
  daySubtitle: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.textMuted,
    marginTop: Spacing.XX_SMALL
  },
  caloriesValue: {
    fontSize: FontSize.CARD_TITLE,
    fontWeight: '700',
    color: Theme.colors.text
  },
  columnLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.MEDIUM,
    paddingBottom: Spacing.X_SMALL,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Theme.colors.hairline
  },
  columnLabel: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Theme.colors.textMuted
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.SMALL,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Theme.colors.hairline
  },
  mealRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0
  },
  mealInfo: {
    flex: 1,
    marginRight: Spacing.SMALL
  },
  mealName: {
    fontSize: FontSize.BODY,
    fontWeight: '600',
    color: Theme.colors.text
  },
  mealMacros: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted,
    marginTop: Spacing.XX_SMALL
  },
  mealCalories: {
    fontSize: FontSize.BODY,
    fontWeight: '700',
    color: Theme.colors.textSecondary
  }
})

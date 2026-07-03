import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  card: {
    ...Shadow.CARD,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD,
    padding: Spacing.MEDIUM,
    marginBottom: Spacing.SMALL
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
  caloriesColumn: {
    alignItems: 'flex-end'
  },
  caloriesValue: {
    fontSize: FontSize.CARD_TITLE,
    fontWeight: '700',
    color: Theme.colors.text
  },
  deltaLabel: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted,
    marginTop: Spacing.XX_SMALL
  },
  deltaLabelOnGoal: {
    fontWeight: '700',
    color: Theme.colors.accentGreen
  },
  chevron: {
    marginLeft: Spacing.X_SMALL
  }
})

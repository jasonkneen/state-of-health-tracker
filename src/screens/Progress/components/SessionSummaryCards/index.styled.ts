import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    columnGap: Spacing.X_SMALL,
    marginTop: Spacing.SMALL
  },
  card: {
    flex: 1,
    backgroundColor: Theme.colors.tile,
    borderRadius: BorderRadius.CARD,
    padding: Spacing.MEDIUM
  },
  cardFullWidth: {
    flex: 1
  },
  prCard: {
    backgroundColor: Theme.colors.tealTint
  },
  label: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4
  },
  prLabel: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '700',
    color: Theme.colors.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.4
  },
  value: {
    fontSize: FontSize.CARD_TITLE,
    fontWeight: '700',
    marginTop: Spacing.XX_SMALL
  },
  prValue: {
    fontSize: FontSize.CARD_TITLE,
    fontWeight: '700',
    color: Theme.colors.white,
    marginTop: Spacing.XX_SMALL
  },
  caption: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted,
    marginTop: 2
  },
  prCaption: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.greenOnTint,
    marginTop: 2
  }
})

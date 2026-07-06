import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.tealTint,
    borderRadius: BorderRadius.CARD,
    padding: Spacing.MEDIUM,
    marginTop: Spacing.SMALL
  },
  label: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '700',
    color: Theme.colors.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.4
  },
  value: {
    fontSize: FontSize.CARD_TITLE,
    fontWeight: '700',
    color: Theme.colors.white,
    marginTop: Spacing.XX_SMALL
  },
  caption: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.greenOnTint,
    marginTop: Spacing.XX_SMALL
  }
})

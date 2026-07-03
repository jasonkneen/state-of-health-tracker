import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    paddingVertical: Spacing.X_LARGE,
    paddingHorizontal: Spacing.MEDIUM,
    alignItems: 'center'
  },
  title: {
    fontSize: FontSize.CARD_TITLE,
    fontWeight: '700'
  },
  subtitle: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.XX_SMALL,
    maxWidth: 260
  }
})

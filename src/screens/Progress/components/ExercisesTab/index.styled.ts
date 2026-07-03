import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  emptyState: {
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    paddingVertical: Spacing.X_LARGE,
    paddingHorizontal: Spacing.MEDIUM,
    alignItems: 'center',
    marginTop: Spacing.MEDIUM
  },
  emptyTitle: {
    fontSize: FontSize.CARD_TITLE,
    fontWeight: '700'
  },
  emptySubtitle: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.XX_SMALL,
    maxWidth: 260
  },
  noteText: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted,
    marginTop: Spacing.SMALL
  }
})

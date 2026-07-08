import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  row: {
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.ITEM,
    paddingVertical: Spacing.SMALL,
    paddingHorizontal: Spacing.MEDIUM,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.SMALL,
    marginTop: Spacing.X_SMALL
  },
  details: {
    flex: 1
  },
  title: {
    fontSize: FontSize.PARAGRAPH,
    fontWeight: '600'
  },
  caption: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted,
    marginTop: Spacing.XX_SMALL / 2
  },
  badge: {
    fontSize: FontSize.CAPTION,
    fontWeight: '700',
    color: Theme.colors.accentGreen
  },
  badgeTeal: {
    color: Theme.colors.teal
  },
  badgeDanger: {
    color: Theme.colors.error
  }
})

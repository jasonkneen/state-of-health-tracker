import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    marginTop: Spacing.MEDIUM
  },
  header: {
    fontSize: FontSize.H3,
    fontWeight: '700',
    marginBottom: Spacing.XX_SMALL
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.ITEM,
    paddingVertical: Spacing.SMALL,
    paddingHorizontal: Spacing.MEDIUM,
    marginTop: Spacing.X_SMALL
  },
  details: {
    flex: 1
  },
  date: {
    fontSize: FontSize.PARAGRAPH,
    fontWeight: '600'
  },
  caption: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted,
    marginTop: 2
  },
  oneRepMax: {
    fontSize: FontSize.LABEL,
    fontWeight: '700',
    color: Theme.colors.accentGreen
  }
})

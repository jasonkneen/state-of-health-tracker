import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: FontSize.H1
  },
  subtitle: {
    fontWeight: '200',
    marginTop: Spacing.XX_SMALL,
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textSecondary
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.inputBorder,
    marginTop: Spacing.MEDIUM,
    marginBottom: Spacing.XX_SMALL
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.SMALL,
    paddingVertical: Spacing.SMALL
  },
  optionLabel: {
    fontWeight: '600',
    fontSize: FontSize.H2
  }
})

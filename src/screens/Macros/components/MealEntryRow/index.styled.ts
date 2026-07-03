import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: Spacing.SMALL,
    paddingVertical: Spacing.SMALL,
    backgroundColor: Theme.colors.card
  },
  nameContainer: {
    flex: 1
  },
  name: {
    fontSize: FontSize.BODY,
    fontWeight: '600'
  },
  servingText: {
    fontWeight: '400',
    color: Theme.colors.textSecondary
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    columnGap: Spacing.XX_SMALL
  },
  calories: {
    fontSize: FontSize.BODY,
    fontWeight: '700'
  },
  caloriesLabel: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textSecondary
  }
})

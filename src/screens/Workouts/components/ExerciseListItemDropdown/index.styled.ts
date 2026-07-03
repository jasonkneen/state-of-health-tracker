import {StyleSheet} from 'react-native'

import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  dropdownCard: {
    margin: Spacing.X_SMALL,
    padding: Spacing.SMALL,
    width: 200,
    borderTopLeftRadius: 0,
    borderRadius: 10,
    backgroundColor: Theme.colors.secondary
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  menuItemSpaced: {
    marginTop: Spacing.XX_SMALL,
    alignItems: 'center',
    flexDirection: 'row'
  },
  menuItemLabel: {
    fontWeight: 'bold',
    marginLeft: Spacing.SMALL
  }
})

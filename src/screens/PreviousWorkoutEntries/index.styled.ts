import {StyleSheet} from 'react-native'

import Spacing from '@styles/spacing'

export default StyleSheet.create({
  list: {
    paddingTop: Spacing.MEDIUM,
    flex: 1
  },
  icon: {
    alignSelf: 'center',
    marginTop: Spacing.MEDIUM
  },
  chipIcon: {
    marginRight: Spacing.XX_SMALL
  },
  chipContainer: {
    paddingRight: Spacing.SMALL,
    paddingLeft: Spacing.SMALL,
    alignSelf: 'flex-start',
    marginRight: Spacing.X_SMALL
  },
  footerSpinner: {
    marginVertical: Spacing.MEDIUM
  }
})

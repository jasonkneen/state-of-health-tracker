import {StyleSheet} from 'react-native'

import Spacing from '@styles/spacing'

export default StyleSheet.create({
  list: {
    paddingTop: Spacing.MEDIUM,
    height: '100%'
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
    alignSelf: 'flex-start'
  },
  footerSpinner: {
    marginVertical: Spacing.MEDIUM
  }
})

import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    backgroundColor: Theme.colors.secondary,
    borderRadius: BorderRadius.CHIP,
    alignItems: 'center',
    justifyContent: 'center'
  },
  weightedIcon: {
    marginTop: -3
  },
  barbellIcon: {
    marginRight: -2
  }
})

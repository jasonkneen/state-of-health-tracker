import {StyleSheet} from 'react-native'

import Spacing from '@styles/spacing'

export default StyleSheet.create({
  toggleButton: {
    zIndex: 100
  },
  toggleIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: 50,
    marginRight: Spacing.SMALL
  }
})

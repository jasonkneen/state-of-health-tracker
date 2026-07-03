import {StyleSheet} from 'react-native'

import {Theme} from '@styles/theme'

export default StyleSheet.create({
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.overlayBackdrop,
    opacity: 0.5,
    position: 'absolute',
    justifyContent: 'center',
    zIndex: 1000
  }
})

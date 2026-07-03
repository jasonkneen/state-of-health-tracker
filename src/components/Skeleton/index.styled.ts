import {StyleSheet} from 'react-native'

import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.track,
    overflow: 'hidden',
    position: 'relative'
  },
  gradient: {
    width: '100%',
    height: '100%'
  }
})

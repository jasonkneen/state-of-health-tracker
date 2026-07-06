import {Animated, StyleSheet, ViewStyle} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export const countdownScale = (scale: Animated.Value): Animated.WithAnimatedObject<ViewStyle> => ({
  transform: [{scale}]
})

export default StyleSheet.create({
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  countdownValue: {
    fontSize: 120,
    fontWeight: '700',
    color: Theme.colors.white,
    textAlign: 'center'
  },
  countdownSubtext: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.white,
    marginTop: Spacing.MEDIUM,
    textAlign: 'center'
  }
})

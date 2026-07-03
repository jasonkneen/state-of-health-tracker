import {Animated, ViewStyle} from 'react-native'

export const deleteActionTouchable = (marginRight: number): ViewStyle => ({
  width: '25%',
  marginRight
})

export const deleteActionAnimated = (
  translation: Animated.AnimatedInterpolation<string | number>
): Animated.WithAnimatedObject<ViewStyle> => ({
  height: '100%',
  justifyContent: 'center',
  alignItems: 'flex-end',
  transform: [{translateX: translation}]
})

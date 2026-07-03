import React from 'react'

import {StyleProp, TextStyle} from 'react-native'

import Animated, {Easing, EntryExitAnimationFunction, FadeOut, withTiming} from 'react-native-reanimated'

import Text from '@components/Text'

const TICK_IN_DURATION_MS = 130
const TICK_OUT_DURATION_MS = 80
const TICK_OFFSET = 8

interface Props {
  text: string
  direction?: 1 | -1
  style?: StyleProp<TextStyle>
}

// direction 1 rolls upward (new text slides in from below), -1 rolls downward
const buildEntering = (direction: 1 | -1): EntryExitAnimationFunction => {
  return () => {
    'worklet'

    return {
      initialValues: {opacity: 0, transform: [{translateY: TICK_OFFSET * direction}]},
      animations: {
        opacity: withTiming(1, {duration: TICK_IN_DURATION_MS, easing: Easing.out(Easing.cubic)}),
        transform: [{translateY: withTiming(0, {duration: TICK_IN_DURATION_MS, easing: Easing.out(Easing.cubic)})}]
      }
    }
  }
}

// Ticker-style text: when `text` changes the old value fades out in place
// while the new one slides in, keyed so React remounts the view per value
const TickerText = ({text, direction = 1, style}: Props) => (
  <Animated.View key={text} entering={buildEntering(direction)} exiting={FadeOut.duration(TICK_OUT_DURATION_MS)}>
    <Text style={style}>{text}</Text>
  </Animated.View>
)

export default TickerText

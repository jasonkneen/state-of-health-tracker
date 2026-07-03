import React, {useEffect, useRef, useState} from 'react'

import {Animated, View} from 'react-native'

import Text from '@components/Text'

import {RUN_COUNTDOWN_SUBTEXT} from '@constants/strings'

import styles, {countdownScale} from './index.styled'

const COUNTDOWN_START = 3
const COUNTDOWN_STEP_MS = 900

interface Props {
  onComplete: () => void
}

const RunCountdownOverlay = ({onComplete}: Props) => {
  const [value, setValue] = useState(COUNTDOWN_START)
  const scale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    scale.setValue(0.6)
    Animated.spring(scale, {toValue: 1, useNativeDriver: true, friction: 5}).start()

    const timer = setTimeout(() => {
      if (value === 1) {
        onComplete()
      } else {
        setValue(current => current - 1)
      }
    }, COUNTDOWN_STEP_MS)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-fires once per count value
  }, [value])

  return (
    <View style={styles.countdownOverlay}>
      <Animated.View style={countdownScale(scale)}>
        <Text style={styles.countdownValue}>{value}</Text>
      </Animated.View>

      <Text style={styles.countdownSubtext}>{RUN_COUNTDOWN_SUBTEXT}</Text>
    </View>
  )
}

export default RunCountdownOverlay

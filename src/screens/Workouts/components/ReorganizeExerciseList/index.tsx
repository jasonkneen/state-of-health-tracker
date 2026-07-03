import React, {useEffect} from 'react'

import {TouchableOpacity} from 'react-native'

import {DailyExercise} from '@data/models/DailyExercise'
import {Ionicons} from '@expo/vector-icons'
import {Theme} from '@styles/theme'
import * as Haptics from 'expo-haptics'
import DraggableFlatList, {RenderItemParams, ScaleDecorator} from 'react-native-draggable-flatlist'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'

import Text from '@components/Text'

import styles from './index.styled'

const WIGGLE_ANGLE_DEG = 0.6
const WIGGLE_DURATION_MS = 180
const WIGGLE_SETTLE_MS = 80

interface WiggleViewProps {
  readonly index: number
  readonly isPaused: boolean
  readonly children: React.ReactNode
}

// iOS home-screen style jiggle. Direction alternates and the start is
// staggered per row so the cards don't wiggle in lockstep.
const WiggleView = (props: WiggleViewProps) => {
  const {index, isPaused, children} = props

  const rotation = useSharedValue(0)

  useEffect(() => {
    if (isPaused) {
      cancelAnimation(rotation)
      rotation.value = withTiming(0, {duration: WIGGLE_SETTLE_MS})

      return
    }

    const direction = index % 2 === 0 ? 1 : -1

    rotation.value = withDelay(
      (index % 3) * 50,
      withRepeat(
        withSequence(
          withTiming(direction * WIGGLE_ANGLE_DEG, {
            duration: WIGGLE_DURATION_MS,
            easing: Easing.inOut(Easing.quad)
          }),
          withTiming(-direction * WIGGLE_ANGLE_DEG, {
            duration: WIGGLE_DURATION_MS,
            easing: Easing.inOut(Easing.quad)
          })
        ),
        -1,
        true
      )
    )

    return () => cancelAnimation(rotation)
  }, [index, isPaused, rotation])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{rotateZ: `${rotation.value}deg`}]
  }))

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}

interface Props {
  readonly dailyExercises: DailyExercise[]
  readonly onReorder: (dailyExercises: DailyExercise[]) => void
  readonly listHeader?: React.ReactElement
}

const ReorganizeExerciseList = (props: Props) => {
  const {dailyExercises, onReorder, listHeader} = props

  const setCountLabel = (dailyExercise: DailyExercise) =>
    dailyExercise.sets.length === 1 ? '1 set' : `${dailyExercise.sets.length} sets`

  const renderItem = ({item, drag, isActive, getIndex}: RenderItemParams<DailyExercise>) => (
    <ScaleDecorator activeScale={1.04}>
      <WiggleView index={getIndex() ?? 0} isPaused={isActive}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          delayLongPress={100}
          onLongPress={drag}
          disabled={isActive}>
          <Ionicons name="reorder-three" size={24} color={Theme.colors.textSecondary} />

          <Text numberOfLines={1} style={styles.cardTitle}>
            {item.exercise.name}
          </Text>

          <Text style={styles.setCount}>{setCountLabel(item)}</Text>
        </TouchableOpacity>
      </WiggleView>
    </ScaleDecorator>
  )

  return (
    <DraggableFlatList
      containerStyle={styles.listContainer}
      data={dailyExercises}
      keyExtractor={item => item.id}
      ListHeaderComponent={listHeader}
      onDragBegin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
      onPlaceholderIndexChange={() => Haptics.selectionAsync()}
      onDragEnd={({data}) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onReorder(data)
      }}
      renderItem={renderItem}
    />
  )
}

export default ReorganizeExerciseList

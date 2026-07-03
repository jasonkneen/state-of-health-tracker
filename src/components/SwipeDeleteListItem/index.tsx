import React from 'react'

import {Animated, TouchableOpacity, ViewProps} from 'react-native'

import {Ionicons} from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler'

import {Theme} from '@styles/theme'

import {deleteActionAnimated, deleteActionTouchable} from './index.styled'

interface Props extends ViewProps {
  readonly deleteIconRightMargin?: number
  readonly onDeletePressed?: () => void
  readonly swipeableRef?: (ref: Swipeable) => void
  readonly onSwipeActivated?: () => void
  readonly isSwipeable?: boolean
}

const SwipeDeleteListItem = (props: Props) => {
  const {
    children,
    deleteIconRightMargin = 0,
    swipeableRef,
    onSwipeActivated,
    onDeletePressed,
    isSwipeable = true
  } = props

  return (
    <GestureHandlerRootView>
      <Swipeable
        enabled={isSwipeable}
        ref={ref => {
          if (ref) {
            swipeableRef?.(ref)
          }
        }}
        onActivated={() => {
          onSwipeActivated?.()
        }}
        renderRightActions={(_progressAnimatedValue, dragAnimatedValue) => {
          const translation = dragAnimatedValue.interpolate({
            inputRange: [0, 75, 75, 100],
            outputRange: [-20, 0, 0, 1]
          })

          return (
            <TouchableOpacity
              style={deleteActionTouchable(deleteIconRightMargin)}
              onPress={() => {
                onDeletePressed?.()
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }}>
              <Animated.View style={deleteActionAnimated(translation)}>
                <Ionicons name="trash-bin-outline" size={24} color={Theme.colors.error} />
              </Animated.View>
            </TouchableOpacity>
          )
        }}>
        {children}
      </Swipeable>
    </GestureHandlerRootView>
  )
}

export default SwipeDeleteListItem

import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import {Theme} from '@styles/theme'
import {Swipeable} from 'react-native-gesture-handler'

import Text from '@components/Text'

import SwipeDeleteListItem from '../SwipeDeleteListItem'
import styles, {itemBackground} from './index.styled'

interface Props {
  readonly title: string
  readonly subtitle?: string
  readonly chip?: React.JSX.Element
  readonly leading?: React.JSX.Element
  readonly swipeableRef?: (ref: Swipeable) => void
  readonly onSwipeActivated?: () => void
  readonly onDeletePressed?: () => void
  readonly showLeftBorder?: boolean
  readonly showRightBorder?: boolean
  readonly onPress?: () => void
  readonly leftRightMargin?: number
  readonly deleteIconRightMargin?: number
  readonly isSwipeable?: boolean
  readonly backgroundColor?: string
  readonly isTappable?: boolean
}

const ListItem = (props: Props) => {
  const {
    title,
    subtitle,
    chip,
    leading,
    onDeletePressed,
    swipeableRef,
    onSwipeActivated,
    showLeftBorder = false,
    showRightBorder = false,
    onPress,
    leftRightMargin = 28,
    deleteIconRightMargin = 0,
    isSwipeable = true,
    backgroundColor = Theme.colors.background,
    isTappable = true
  } = props

  return (
    <>
      <SwipeDeleteListItem
        isSwipeable={isSwipeable}
        deleteIconRightMargin={deleteIconRightMargin}
        onDeletePressed={onDeletePressed}
        key={title + subtitle}
        swipeableRef={swipeableRef}
        onSwipeActivated={onSwipeActivated}>
        <TouchableOpacity
          disabled={!isTappable}
          activeOpacity={0.5}
          delayPressIn={50}
          onPress={() => {
            onPress?.()
          }}>
          <View style={[styles.item, itemBackground(backgroundColor, leftRightMargin)]}>
            {leading && <View style={styles.leadingContainer}>{leading}</View>}

            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>

              {subtitle && (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {subtitle}
                </Text>
              )}
            </View>

            <View style={styles.chipContainer}>{chip && chip}</View>
          </View>
        </TouchableOpacity>
      </SwipeDeleteListItem>

      {showLeftBorder && <View style={styles.leftBorder} />}

      {showRightBorder && <View style={styles.rightBorder} />}
    </>
  )
}

export default ListItem

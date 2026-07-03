import React from 'react'

import {TouchableOpacity, View, ViewProps} from 'react-native'

import Text from '@components/Text'

import SecondaryButton from '../SecondaryButton'
import styles from './index.styled'

interface Props {
  readonly key: string
  readonly title: string
  readonly buttonText?: string
  readonly onTitlePressed?: (topMargin?: number) => void
  readonly onButtonPressed?: () => void
}

const SectionListHeader = (props: Props) => {
  const {key, title, onTitlePressed, buttonText, onButtonPressed} = props

  return (
    <View style={styles.header} key={key}>
      <TouchableOpacity
        style={styles.titleButton}
        activeOpacity={0.5}
        onPress={event => {
          onTitlePressed?.(event.nativeEvent.pageY - event.nativeEvent.locationY)
        }}>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
      </TouchableOpacity>

      <SecondaryButton
        label={buttonText}
        style={styles.button}
        onPress={() => {
          onButtonPressed?.()
        }}
      />
    </View>
  )
}

export default SectionListHeader

export const SectionListFooter = (props: ViewProps) => {
  const {children} = props

  return <View style={styles.footer}>{children}</View>
}

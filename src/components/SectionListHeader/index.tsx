import React from 'react'

import {TouchableOpacity, View, ViewProps} from 'react-native'

import Text from '@components/Text'

import SecondaryButton from '../SecondaryButton'
import styles from './index.styled'

interface Props {
  readonly title: string
  readonly subtitle?: string
  readonly buttonText?: string
  readonly onTitlePressed?: (topMargin?: number) => void
  readonly onButtonPressed?: () => void
}

const SectionListHeader = (props: Props) => {
  const {title, subtitle, onTitlePressed, buttonText, onButtonPressed} = props

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.titleButton}
        activeOpacity={0.5}
        disabled={!onTitlePressed}
        onPress={event => {
          onTitlePressed?.(event.nativeEvent.pageY - event.nativeEvent.locationY)
        }}>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>

        {subtitle && (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </TouchableOpacity>

      {buttonText && (
        <SecondaryButton
          label={buttonText}
          style={styles.button}
          onPress={() => {
            onButtonPressed?.()
          }}
        />
      )}
    </View>
  )
}

export default SectionListHeader

export const SectionListFooter = (props: ViewProps) => {
  const {children} = props

  return <View style={styles.footer}>{children}</View>
}

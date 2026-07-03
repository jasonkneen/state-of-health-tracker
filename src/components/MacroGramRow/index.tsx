import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import Text from '@components/Text'

import styles, {dotFill} from './index.styled'

interface Props {
  label: string
  grams: number
  dotColor: string
  isLast?: boolean
  onPress?: () => void
}

const MacroGramRow = ({label, grams, dotColor, isLast = false, onPress}: Props) => {
  const rowStyle = [styles.container, !isLast && styles.containerDivider]

  const content = (
    <>
      <View style={[styles.dot, dotFill(dotColor)]} />

      <Text style={styles.label}>{label}</Text>

      <Text style={styles.grams}>{`${Math.round(grams)}g`}</Text>
    </>
  )

  if (onPress) {
    return (
      <TouchableOpacity style={rowStyle} activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    )
  }

  return <View style={rowStyle}>{content}</View>
}

export default MacroGramRow

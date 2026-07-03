import React from 'react'

import {TextInput as DefaultTextInput, TextInputProps} from 'react-native'

import {Theme} from '@styles/theme'

import styles from './index.styled'

const TextInput = (props: TextInputProps) => {
  const {style, editable = true, numberOfLines = 1, maxLength = 24, ...otherProps} = props

  return (
    <DefaultTextInput
      keyboardAppearance="dark"
      editable={editable}
      numberOfLines={numberOfLines}
      maxLength={maxLength}
      selectionColor={Theme.colors.accentGreen}
      placeholderTextColor={Theme.colors.textFaint}
      style={[styles.textInput, style]}
      {...otherProps}
    />
  )
}

export default TextInput

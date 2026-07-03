import React from 'react'

import {KeyboardTypeOptions} from 'react-native'

import Text from '@components/Text'
import TextInput from '@components/TextInput'

import styles from './index.styled'

export interface TextInputProps {
  header: string
  onChangeText?: (text: string) => void
  placeholder?: string
  keyboardType?: KeyboardTypeOptions
  maxLength?: number
  value?: string
  showError?: boolean
  errorMessage?: string
  secureTextEntry?: boolean
}

const TextInputWithHeader = (props: TextInputProps) => {
  const {
    header,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    maxLength,
    value,
    errorMessage,
    showError = false,
    secureTextEntry = false
  } = props

  return (
    <>
      <Text style={styles.header}>{header}</Text>

      <TextInput
        returnKeyType="done"
        style={styles.input}
        maxLength={maxLength}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        value={value}
        secureTextEntry={secureTextEntry}
      />

      {showError && <Text style={styles.error}>{errorMessage}</Text>}
    </>
  )
}

export default TextInputWithHeader

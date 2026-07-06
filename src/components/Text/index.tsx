import React from 'react'

import {Text as DefaultText, TextProps} from 'react-native'

import styles from './index.styled'

const Text = (props: TextProps) => {
  const {style, ...otherProps} = props

  return <DefaultText style={[styles.text, style]} {...otherProps} />
}

export default Text

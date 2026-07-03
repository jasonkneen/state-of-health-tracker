import React from 'react'

import {SafeAreaView, ViewProps} from 'react-native'

import styles from './index.styled'

const Screen = (props: ViewProps) => {
  const {...otherProps} = props

  return <SafeAreaView style={styles.screen} {...otherProps} />
}

export default Screen

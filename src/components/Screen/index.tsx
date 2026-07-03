import React from 'react'

import {SafeAreaView, SafeAreaViewProps} from 'react-native-safe-area-context'

import styles from './index.styled'

const Screen = (props: SafeAreaViewProps) => {
  const {...otherProps} = props

  return <SafeAreaView style={styles.screen} {...otherProps} />
}

export default Screen

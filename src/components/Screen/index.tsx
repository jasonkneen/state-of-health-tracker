import React from 'react'

import {ViewProps} from 'react-native'

import {SafeAreaView} from 'react-native-safe-area-context'

import styles from './index.styled'

const Screen = (props: ViewProps) => {
  const {...otherProps} = props

  return <SafeAreaView style={styles.screen} {...otherProps} />
}

export default Screen

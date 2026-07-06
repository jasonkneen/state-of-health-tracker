import React from 'react'

import {View} from 'react-native'

import Text from '@components/Text'

import {RUNS_EMPTY_SUBTITLE, RUNS_EMPTY_TITLE} from '@constants/strings'

import styles from './index.styled'

const EmptyRunsState = () => (
  <View style={styles.container}>
    <Text style={styles.title}>{RUNS_EMPTY_TITLE}</Text>

    <Text style={styles.subtitle}>{RUNS_EMPTY_SUBTITLE}</Text>
  </View>
)

export default EmptyRunsState

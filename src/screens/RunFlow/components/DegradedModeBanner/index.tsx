import React from 'react'

import {View} from 'react-native'

import Text from '@components/Text'

import {RUN_DEGRADED_BANNER} from '@constants/strings'

import styles from './index.styled'

const DegradedModeBanner = () => (
  <View style={styles.banner}>
    <Text style={styles.bannerText}>{RUN_DEGRADED_BANNER}</Text>
  </View>
)

export default DegradedModeBanner

import React from 'react'

import {View} from 'react-native'

import Text from '@components/Text'

import {PROGRESS_COMING_SOON_TITLE} from '@constants/strings'

import styles from './index.styled'

interface Props {
  subtitle: string
}

const ComingSoonPanel = ({subtitle}: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{PROGRESS_COMING_SOON_TITLE}</Text>

    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
)

export default ComingSoonPanel

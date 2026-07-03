import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import {Ionicons} from '@expo/vector-icons'
import {Theme} from '@styles/theme'

import Text from '@components/Text'

import {PROGRESS_SELECTED_EXERCISE_LABEL} from '@constants/strings'

import styles from './index.styled'

interface Props {
  exerciseName: string
  onPress: () => void
}

const SelectedExerciseHeader = ({exerciseName, onPress}: Props) => (
  <View style={styles.container}>
    <Text style={styles.label}>{PROGRESS_SELECTED_EXERCISE_LABEL}</Text>

    <TouchableOpacity style={styles.chip} activeOpacity={0.7} onPress={onPress}>
      <Text style={styles.chipLabel} numberOfLines={1}>
        {exerciseName}
      </Text>

      <Ionicons name="chevron-down" size={16} color={Theme.colors.textSecondary} />
    </TouchableOpacity>
  </View>
)

export default SelectedExerciseHeader

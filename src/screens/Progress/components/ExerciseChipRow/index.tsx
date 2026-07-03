import React from 'react'

import {ScrollView, TouchableOpacity} from 'react-native'

import {Exercise} from '@data/models/Exercise'

import Text from '@components/Text'

import styles from './index.styled'

interface Props {
  exercises: Exercise[]
  selectedExerciseId: string | undefined
  onSelect: (exerciseId: string) => void
}

const ExerciseChipRow = ({exercises, selectedExerciseId, onSelect}: Props) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.row}
    contentContainerStyle={styles.rowContent}>
    {exercises.map(exercise => {
      const isSelected = exercise.id === selectedExerciseId

      return (
        <TouchableOpacity
          key={exercise.id}
          style={[styles.chip, isSelected && styles.chipSelected]}
          activeOpacity={0.7}
          onPress={() => onSelect(exercise.id)}>
          <Text style={[styles.label, isSelected && styles.labelSelected]}>{exercise.name}</Text>
        </TouchableOpacity>
      )
    })}
  </ScrollView>
)

export default ExerciseChipRow

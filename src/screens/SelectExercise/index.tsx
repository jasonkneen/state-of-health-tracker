import React, {useState} from 'react'

import {ScrollView, TouchableOpacity, View} from 'react-native'

import {Ionicons} from '@expo/vector-icons'
import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {useNavigation} from '@react-navigation/native'
import useProgressStore from '@store/progress/useProgressStore'
import {Theme} from '@styles/theme'
import {filterExercises} from '@utility/filterExercises'
import {formatExerciseSubtitle} from '@utility/formatExerciseSubtitle'

import SearchBar from '@components/SearchBar'
import Text from '@components/Text'

import {PROGRESS_SELECT_EXERCISE_TITLE, SEARCH_EXERCISES_PLACEHOLDER} from '@constants/strings'

import styles from './index.styled'

const SelectExerciseScreen = () => {
  const {goBack} = useNavigation()
  const {data: allExercises = []} = useExercisesQuery()
  const selectedExerciseId = useProgressStore(state => state.selectedExerciseId)
  const setSelectedExerciseId = useProgressStore(state => state.setSelectedExerciseId)
  const [searchText, setSearchText] = useState('')

  const exercises = filterExercises(allExercises, searchText)

  const onExercisePressed = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId)
    goBack()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{PROGRESS_SELECT_EXERCISE_TITLE}</Text>

        <TouchableOpacity style={styles.closeButton} activeOpacity={0.7} onPress={goBack}>
          <Ionicons name="close" size={20} color={Theme.colors.text} />
        </TouchableOpacity>
      </View>

      <SearchBar placeholder={SEARCH_EXERCISES_PLACEHOLDER} onSearchTextChanged={setSearchText} />

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {exercises.map(exercise => {
          const isSelected = exercise.id === selectedExerciseId
          const subtitle = formatExerciseSubtitle(exercise.exerciseType, exercise.exerciseBodyPart)

          return (
            <TouchableOpacity
              key={exercise.id}
              style={[styles.row, isSelected && styles.rowSelected]}
              activeOpacity={0.7}
              onPress={() => onExercisePressed(exercise.id)}>
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, isSelected && styles.rowLabelSelected]} numberOfLines={1}>
                  {exercise.name}
                </Text>

                {subtitle && (
                  <Text style={styles.rowSubtitle} numberOfLines={1}>
                    {subtitle}
                  </Text>
                )}
              </View>

              {isSelected && <Ionicons name="checkmark-circle" size={22} color={Theme.colors.accentGreen} />}
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default SelectExerciseScreen

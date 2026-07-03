import React from 'react'

import {FlatList, ListRenderItemInfo} from 'react-native'

import {Exercise} from '@data/models/Exercise'
import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {useNavigation, useRoute} from '@react-navigation/native'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import {Text, useStyleTheme} from '@styles/theme'

import ExerciseTypeChip from '@components/ExerciseTypeChip'
import ListItem from '@components/ListItem'
import PrimaryButton from '@components/PrimaryButton'
import {showToast} from '@components/toast/util/ShowToast'

import {
  stringWithParameters,
  TEMPLATE_START,
  TOAST_TEMPLATE_EXERCISES_ADDED,
  TOAST_TEMPLATE_EXERCISES_ADDED_BODY
} from '@constants/strings'

import styles from './index.styled'
import {Navigation, WorkoutTemplateRoute} from '../../navigation/types'

const WorkoutTemplateDetailScreen = () => {
  const {pop} = useNavigation<Navigation>()
  const {
    params: {template}
  } = useRoute<WorkoutTemplateRoute>()

  const {data: allExercises = []} = useExercisesQuery()
  const {addDailyExercise} = useDailyWorkoutEntryStore()

  const exercises = allExercises.filter(exercise => template.exerciseIds.includes(exercise.id))

  const addExerciseToDailyEntry = () => {
    exercises.forEach(exercise => {
      addDailyExercise(exercise)
    })
  }

  const onStartWorkoutPressed = () => {
    addExerciseToDailyEntry()
    showToast(
      'success',
      TOAST_TEMPLATE_EXERCISES_ADDED,
      stringWithParameters(TOAST_TEMPLATE_EXERCISES_ADDED_BODY, template.name)
    )
    pop(2)
  }

  const renderItem = ({item}: ListRenderItemInfo<Exercise>) => (
    <ListItem
      isTappable={false}
      isSwipeable={false}
      leftRightMargin={styles.itemMargin.marginHorizontal}
      title={item.name}
      subtitle={item.exerciseBodyPart}
      chip={<ExerciseTypeChip exerciseType={item.exerciseType} />}
    />
  )

  return (
    <FlatList
      stickyHeaderIndices={[0]}
      data={exercises}
      ListHeaderComponent={
        <Text style={[styles.headerText, {backgroundColor: useStyleTheme().colors.background}]}>{template.name}</Text>
      }
      ListFooterComponent={
        <PrimaryButton style={styles.footerButton} label={TEMPLATE_START} onPress={onStartWorkoutPressed} />
      }
      renderItem={renderItem}
    />
  )
}

export default WorkoutTemplateDetailScreen

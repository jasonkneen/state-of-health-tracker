import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import {ExerciseTemplate} from '@data/models/ExerciseTemplate'
import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {useNavigation} from '@react-navigation/native'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import {Theme} from '@styles/theme'

import TemplateOptionsBottomSheet from '@screens/AddExercise/components/TemplateOptionsBottomSheet'

import {closeGlobalBottomSheet, openGlobalBottomSheet} from '@components/GlobalBottomSheet'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import {
  stringWithParameters,
  TOAST_TEMPLATE_EXERCISES_ADDED,
  TOAST_TEMPLATE_EXERCISES_ADDED_BODY
} from '@constants/strings'

import styles from './index.styled'

interface Props {
  template: ExerciseTemplate
}

const TemplateListItem = ({template}: Props) => {
  const {goBack} = useNavigation()

  const {data: allExercises = []} = useExercisesQuery()
  const {addDailyExercise} = useDailyWorkoutEntryStore()

  const templateExercises = allExercises.filter(exercise => template.exerciseIds.includes(exercise.id))

  const onStartWorkoutPressed = () => {
    closeGlobalBottomSheet()
    templateExercises.forEach(exercise => addDailyExercise(exercise))
    showToast(
      'success',
      TOAST_TEMPLATE_EXERCISES_ADDED,
      stringWithParameters(TOAST_TEMPLATE_EXERCISES_ADDED_BODY, template.name)
    )
    goBack()
  }

  const onPress = () => {
    openGlobalBottomSheet(
      <TemplateOptionsBottomSheet
        template={template}
        exercises={templateExercises}
        onStartPressed={onStartWorkoutPressed}
      />
    )
  }

  return (
    <TouchableOpacity activeOpacity={0.5} delayPressIn={50} onPress={onPress}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: Theme.colors.background,
            borderColor: Theme.colors.border
          }
        ]}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {template.name}
          </Text>

          <Text style={styles.subtitle} numberOfLines={1}>
            {template.tagline}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default TemplateListItem

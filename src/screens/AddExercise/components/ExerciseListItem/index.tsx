import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import {Exercise} from '@data/models/Exercise'
import {HomeTabsParamList} from '@navigation/HomeTabs'
import {NavigationProp, useNavigation} from '@react-navigation/native'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import useProgressStore from '@store/progress/useProgressStore'
import {Theme} from '@styles/theme'
import {formatExerciseSubtitle} from '@utility/formatExerciseSubtitle'

import ExerciseOptionsBottomSheet from '@screens/AddExercise/components/ExerciseOptionsBottomSheet'

import ExerciseTypeChip from '@components/ExerciseTypeChip'
import {closeGlobalBottomSheet, openGlobalBottomSheet} from '@components/GlobalBottomSheet'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import Screens from '@constants/screens'
import {TOAST_EXERCISE_ADDED, TOAST_EXERCISE_ALREADY_ADDED} from '@constants/strings'

import styles from './index.styled'

interface Props {
  exercise: Exercise
}

const ExerciseListItem = ({exercise}: Props) => {
  const navigation = useNavigation<NavigationProp<HomeTabsParamList>>()

  const subtitle = formatExerciseSubtitle(exercise.exerciseType, exercise.exerciseBodyPart)

  const addDailyExercise = useDailyWorkoutEntryStore(state => state.addDailyExercise)
  const setSelectedExerciseId = useProgressStore(state => state.setSelectedExerciseId)
  const setSelectedSubTab = useProgressStore(state => state.setSelectedSubTab)

  const onAddToWorkoutPressed = () => {
    closeGlobalBottomSheet()
    if (addDailyExercise(exercise)) {
      showToast('success', TOAST_EXERCISE_ADDED, exercise.name)
      navigation.goBack()
    } else {
      showToast('error', TOAST_EXERCISE_ALREADY_ADDED, exercise.name)
    }
  }

  const onViewProgressionPressed = () => {
    closeGlobalBottomSheet()
    setSelectedSubTab('exercises')
    setSelectedExerciseId(exercise.id)
    navigation.navigate('ProgressStack', {screen: Screens.PROGRESS})
  }

  const onPress = () => {
    openGlobalBottomSheet(
      <ExerciseOptionsBottomSheet
        title={exercise.name}
        subtitle={subtitle}
        onAddPressed={onAddToWorkoutPressed}
        onViewProgressionPressed={onViewProgressionPressed}
        exerciseToDelete={exercise}
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
            {exercise.name}
          </Text>

          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {<View style={styles.chipContainer}>{<ExerciseTypeChip exerciseType={exercise.exerciseType} />}</View>}
      </View>
    </TouchableOpacity>
  )
}

export default ExerciseListItem

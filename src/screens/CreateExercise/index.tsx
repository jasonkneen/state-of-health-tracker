import React, {useState} from 'react'

import {View} from 'react-native'

import {ExerciseBodyPartEnum, ExerciseTypeEnum} from '@data/models/Exercise'
import {Ionicons} from '@expo/vector-icons'
import {useCreateExerciseMutation} from '@queries/exercises/useCreateExerciseMutation'
import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {useNavigation} from '@react-navigation/native'
import {Text, useStyleTheme} from '@theme/Theme'

import LoadingOverlay from '@components/LoadingOverlay'
import Picker from '@components/Picker'
import PrimaryButton from '@components/PrimaryButton'
import TextInputWithHeader from '@components/TextInputWithHeader'
import {showToast} from '@components/toast/util/ShowToast'

import {
  CREATE_EXERCISE_BODY_PART_PICKER_HEADER,
  CREATE_EXERCISE_BUTTON_TEXT,
  CREATE_EXERCISE_ERROR,
  CREATE_EXERCISE_EXERCISE_TYPE_PICKER_HEADER,
  CREATE_EXERCISE_NAME_ERROR,
  CREATE_EXERCISE_NAME_HEADER,
  CREATE_EXERCISE_NAME_PLACEHOLDER_TEXT,
  TOAST_ALREADY_EXISTS,
  TOAST_EXERCISE_CREATED
} from '@constants/Strings'

import styles, {createExerciseMaxPickerWidth} from './index.styled'
import {Navigation} from '../../navigation/types'
import {combineExerciseNameType} from '../../utility/combineExerciseNameType'
import {exerciseTypeValues, bodyPartValues} from '../../utility/exercisePickerItems'

const CreateExerciseScreen = () => {
  const theme = useStyleTheme()
  const {goBack} = useNavigation<Navigation>()

  const {data: exercises = []} = useExercisesQuery()
  const {mutateAsync: createExercise, isPending: isCreatingExercise} = useCreateExerciseMutation()

  const [exerciseNameText, setExerciseNameText] = useState('')
  const [showExerciseNameError, setShowExerciseNameError] = useState(false)

  const [exerciseType, setExerciseType] = useState<ExerciseTypeEnum>(ExerciseTypeEnum.BARBELL)
  const [bodyPart, setBodyPart] = useState<ExerciseBodyPartEnum>(ExerciseBodyPartEnum.CHEST)

  const onNameTextChanged = (text: string) => {
    setExerciseNameText(text)
    setShowExerciseNameError(false)
  }

  const onCreateExercisePressed = async () => {
    if (exerciseNameText === '') {
      setShowExerciseNameError(true)

      return
    }

    const alreadyExists = exercises.some(e => e.name === exerciseNameText && e.exerciseType === exerciseType)

    if (alreadyExists) {
      showToast('error', `${combineExerciseNameType(exerciseNameText, exerciseType)} ${TOAST_ALREADY_EXISTS}`)

      return
    }

    try {
      await createExercise({
        name: exerciseNameText,
        exerciseType,
        exerciseBodyPart: bodyPart
      })

      showToast('success', TOAST_EXERCISE_CREATED, exerciseNameText)
      goBack()
    } catch (error) {
      showToast('error', CREATE_EXERCISE_ERROR)
    }
  }

  return (
    <>
      {isCreatingExercise && <LoadingOverlay />}

      <Ionicons style={styles.icon} name="barbell" size={128} color={theme.colors.secondary} />

      <View style={styles.inputContainer}>
        <TextInputWithHeader
          header={CREATE_EXERCISE_NAME_HEADER}
          placeholder={CREATE_EXERCISE_NAME_PLACEHOLDER_TEXT}
          maxLength={30}
          value={exerciseNameText}
          showError={showExerciseNameError}
          errorMessage={CREATE_EXERCISE_NAME_ERROR}
          onChangeText={onNameTextChanged}
        />
      </View>

      <View style={styles.pickerRow}>
        <View style={styles.pickerColumn}>
          <Text style={styles.pickerHeader}>{CREATE_EXERCISE_EXERCISE_TYPE_PICKER_HEADER}</Text>

          <Picker
            initialValue={exerciseType}
            items={exerciseTypeValues}
            width={createExerciseMaxPickerWidth * 0.47 - 4}
            onValueSet={setExerciseType}
          />
        </View>

        <View style={styles.pickerColumn}>
          <Text style={styles.pickerHeader}>{CREATE_EXERCISE_BODY_PART_PICKER_HEADER}</Text>

          <Picker
            initialValue={bodyPart}
            items={bodyPartValues}
            width={createExerciseMaxPickerWidth * 0.47 - 4}
            onValueSet={setBodyPart}
          />
        </View>
      </View>

      <PrimaryButton style={styles.button} label={CREATE_EXERCISE_BUTTON_TEXT} onPress={onCreateExercisePressed} />
    </>
  )
}

export default CreateExerciseScreen

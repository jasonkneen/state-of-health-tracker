import React, {useState} from 'react'

import {View} from 'react-native'

import {deriveLoggingTypeFromExerciseType} from '@data/converters/ExerciseConverter'
import {ExerciseBodyPartEnum, ExerciseTypeEnum} from '@data/models/Exercise'
import {Navigation} from '@navigation/types'
import {useCreateExerciseMutation} from '@queries/exercises/useCreateExerciseMutation'
import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {useNavigation} from '@react-navigation/native'
import {Theme} from '@styles/theme'

import BarbellIcon from '@components/icons/BarbellIcon'
import LoadingOverlay from '@components/LoadingOverlay'
import Picker from '@components/Picker'
import PrimaryButton from '@components/PrimaryButton'
import Text from '@components/Text'
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
} from '@constants/strings'

import styles, {createExerciseMaxPickerWidth} from './index.styled'
import {bodyPartValues, exerciseTypeValues} from './index.util'
import {combineExerciseNameType} from './index.util'

const CreateExerciseScreen = () => {
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
        exerciseBodyPart: bodyPart,
        loggingType: deriveLoggingTypeFromExerciseType(exerciseType)
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

      <View style={styles.icon}>
        <BarbellIcon size={128} color={Theme.colors.secondary} />
      </View>

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

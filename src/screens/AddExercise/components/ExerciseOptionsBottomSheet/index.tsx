import React, {useState} from 'react'

import {Exercise} from '@data/models/Exercise'
import {Ionicons} from '@expo/vector-icons'
import {useDeleteExerciseMutation} from '@queries/exercises/useDeleteExerciseMutation'
import {Theme} from '@styles/theme'

import ConfirmModal from '@components/dialog/ConfirmModal'
import {closeGlobalBottomSheet} from '@components/GlobalBottomSheet'
import OptionsSheetLayout, {SheetOptionItem} from '@components/OptionsSheetLayout'
import {showToast} from '@components/toast/util/ShowToast'

import {
  ADD_TO_DAILY_WORKOUT_BUTTON_TEXT,
  DELETE_BUTTON_TEXT,
  DELETE_EXERCISE_ERROR,
  DELETE_EXERCISE_MODAL_BODY,
  DELETE_EXERCISE_MODAL_TITLE,
  DELETE_EXERCISE_SUCCESS,
  stringWithParameters
} from '@constants/strings'

interface Props {
  readonly title: string
  readonly subtitle?: string
  readonly onAddPressed: () => void
  // When set, the sheet offers Delete for this saved exercise; catalog
  // entries aren't on the user's account yet, so they pass nothing
  readonly exerciseToDelete?: Exercise
}

const ExerciseOptionsBottomSheet = ({title, subtitle, onAddPressed, exerciseToDelete}: Props) => {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)

  const {mutateAsync: deleteExercise} = useDeleteExerciseMutation()

  const closeSheet = () => {
    closeGlobalBottomSheet()
    setIsConfirmModalVisible(false)
  }

  // Safe to toast after the await even though closing the sheet unmounts this
  // component — showToast is a global imperative call, not component state.
  const onConfirmedPressed = async () => {
    if (!exerciseToDelete) return

    closeSheet()
    try {
      await deleteExercise(exerciseToDelete.id)
      showToast('success', DELETE_EXERCISE_SUCCESS)
    } catch {
      showToast('error', DELETE_EXERCISE_ERROR)
    }
  }

  const options: SheetOptionItem[] = [
    {
      key: 'add',
      icon: <Ionicons name="add-circle-outline" size={22} color={Theme.colors.accentGreen} />,
      label: ADD_TO_DAILY_WORKOUT_BUTTON_TEXT,
      onPress: onAddPressed
    }
  ]

  if (exerciseToDelete) {
    options.push({
      key: 'delete',
      icon: <Ionicons name="trash-bin-outline" size={22} color={Theme.colors.error} />,
      label: DELETE_BUTTON_TEXT,
      onPress: () => setIsConfirmModalVisible(true)
    })
  }

  return (
    <>
      {exerciseToDelete && (
        <ConfirmModal
          confirmationTitle={DELETE_EXERCISE_MODAL_TITLE}
          confirmationBody={stringWithParameters(DELETE_EXERCISE_MODAL_BODY, exerciseToDelete.name)}
          isVisible={isConfirmModalVisible}
          onConfirmPressed={onConfirmedPressed}
          onCancel={closeSheet}
        />
      )}

      <OptionsSheetLayout title={title} subtitle={subtitle} options={options} />
    </>
  )
}

export default ExerciseOptionsBottomSheet

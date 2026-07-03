import React, {useState} from 'react'

import {TouchableOpacity, View} from 'react-native'

import {Exercise} from '@data/models/Exercise'
import {Ionicons} from '@expo/vector-icons'
import {useDeleteExerciseMutation} from '@queries/exercises/useDeleteExerciseMutation'
import {Theme} from '@styles/theme'

import ConfirmModal from '@components/dialog/ConfirmModal'
import {closeGlobalBottomSheet} from '@components/GlobalBottomSheet'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import {
  DELETE_BUTTON_TEXT,
  DELETE_EXERCISE_ERROR,
  DELETE_EXERCISE_MODAL_BODY,
  DELETE_EXERCISE_MODAL_TITLE,
  DELETE_EXERCISE_SUCCESS,
  stringWithParameters
} from '@constants/strings'

import styles from './index.styled'

interface Props {
  readonly exercise: Exercise
}

const DeleteExerciseBottomSheet = ({exercise}: Props) => {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)

  const {mutateAsync: deleteExercise} = useDeleteExerciseMutation()

  const handleDeletePressed = () => {
    setIsConfirmModalVisible(true)
  }

  const closeSheet = () => {
    closeGlobalBottomSheet()
    setIsConfirmModalVisible(false)
  }

  // Safe to toast after the await even though closing the sheet unmounts this
  // component — showToast is a global imperative call, not component state.
  const onConfirmedPressed = async () => {
    closeSheet()
    try {
      await deleteExercise(exercise.id)
      showToast('success', DELETE_EXERCISE_SUCCESS)
    } catch {
      showToast('error', DELETE_EXERCISE_ERROR)
    }
  }

  return (
    <>
      <ConfirmModal
        confirmationTitle={DELETE_EXERCISE_MODAL_TITLE}
        confirmationBody={stringWithParameters(DELETE_EXERCISE_MODAL_BODY, exercise.name)}
        isVisible={isConfirmModalVisible}
        onConfirmPressed={onConfirmedPressed}
        onCancel={closeSheet}
      />

      <View>
        <Text style={styles.title} numberOfLines={2}>
          {exercise.name}
        </Text>

        <TouchableOpacity onPress={handleDeletePressed} activeOpacity={0.7} style={styles.deleteContainer}>
          <Ionicons name="trash-bin-outline" size={20} color={Theme.colors.error} />

          <Text style={styles.deleteText}>{DELETE_BUTTON_TEXT}</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default DeleteExerciseBottomSheet

import React, {useState} from 'react'

import {View} from 'react-native'

import {Exercise} from '@data/models/Exercise'
import {ExerciseTemplate} from '@data/models/ExerciseTemplate'
import {Ionicons} from '@expo/vector-icons'
import {useDeleteTemplateMutation} from '@queries/templates/useDeleteTemplateMutation'
import {Theme} from '@styles/theme'

import ConfirmModal from '@components/dialog/ConfirmModal'
import {closeGlobalBottomSheet} from '@components/GlobalBottomSheet'
import OptionsSheetLayout, {SheetOptionItem} from '@components/OptionsSheetLayout'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import {
  DELETE_BUTTON_TEXT,
  DELETE_TEMPLATE_ERROR,
  DELETE_TEMPLATE_MODAL_BODY,
  DELETE_TEMPLATE_MODAL_TITLE,
  stringWithParameters,
  TEMPLATE_EXERCISES_LABEL,
  TEMPLATE_START
} from '@constants/strings'

import styles from './index.styled'

interface Props {
  readonly template: ExerciseTemplate
  readonly exercises: Exercise[]
  readonly onStartPressed: () => void
}

const TemplateOptionsBottomSheet = ({template, exercises, onStartPressed}: Props) => {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)

  const {mutateAsync: deleteTemplate} = useDeleteTemplateMutation()

  const closeSheet = () => {
    closeGlobalBottomSheet()
    setIsConfirmModalVisible(false)
  }

  // Safe to toast after the await even though closing the sheet unmounts this
  // component — showToast is a global imperative call, not component state.
  const onConfirmedPressed = async () => {
    closeSheet()
    try {
      await deleteTemplate(template.id)
    } catch {
      showToast('error', DELETE_TEMPLATE_ERROR)
    }
  }

  const options: SheetOptionItem[] = [
    {
      key: 'start',
      icon: <Ionicons name="play-circle-outline" size={22} color={Theme.colors.accentGreen} />,
      label: TEMPLATE_START,
      onPress: onStartPressed
    },
    {
      key: 'delete',
      icon: <Ionicons name="trash-bin-outline" size={22} color={Theme.colors.error} />,
      label: DELETE_BUTTON_TEXT,
      onPress: () => setIsConfirmModalVisible(true)
    }
  ]

  return (
    <>
      <ConfirmModal
        confirmationTitle={DELETE_TEMPLATE_MODAL_TITLE}
        confirmationBody={stringWithParameters(DELETE_TEMPLATE_MODAL_BODY, template.name)}
        isVisible={isConfirmModalVisible}
        onConfirmPressed={onConfirmedPressed}
        onCancel={closeSheet}
      />

      <OptionsSheetLayout title={template.name} subtitle={template.tagline || undefined} options={options}>
        <Text style={styles.exercisesLabel}>{TEMPLATE_EXERCISES_LABEL}</Text>

        {exercises.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseRow}>
            <Text style={styles.exerciseIndex}>{index + 1}</Text>

            <Text style={styles.exerciseName} numberOfLines={1}>
              {exercise.name}
            </Text>

            <Text style={styles.exerciseBodyPart}>{exercise.exerciseBodyPart}</Text>
          </View>
        ))}
      </OptionsSheetLayout>
    </>
  )
}

export default TemplateOptionsBottomSheet

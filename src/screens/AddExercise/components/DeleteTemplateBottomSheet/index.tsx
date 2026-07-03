import React, {useState} from 'react'

import {TouchableOpacity, View} from 'react-native'

import {ExerciseTemplate} from '@data/models/ExerciseTemplate'
import {Ionicons} from '@expo/vector-icons'
import {useDeleteTemplateMutation} from '@queries/templates/useDeleteTemplateMutation'
import {Text, useStyleTheme} from '@styles/theme'

import ConfirmModal from '@components/dialog/ConfirmModal'
import {closeGlobalBottomSheet} from '@components/GlobalBottomSheet'
import {showToast} from '@components/toast/util/ShowToast'

import {
  DELETE_BUTTON_TEXT,
  DELETE_TEMPLATE_ERROR,
  DELETE_TEMPLATE_MODAL_BODY,
  DELETE_TEMPLATE_MODAL_TITLE,
  DELETE_TEMPLATE_SUCCESS,
  stringWithParameters
} from '@constants/strings'

import styles from './index.styled'

interface Props {
  readonly template: ExerciseTemplate
}

const DeleteTemplateBottomSheet = ({template}: Props) => {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)

  const {mutateAsync: deleteTemplate} = useDeleteTemplateMutation()

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
      await deleteTemplate(template.id)
      showToast('success', DELETE_TEMPLATE_SUCCESS, template.name)
    } catch {
      showToast('error', DELETE_TEMPLATE_ERROR)
    }
  }

  return (
    <>
      <ConfirmModal
        confirmationTitle={DELETE_TEMPLATE_MODAL_TITLE}
        confirmationBody={stringWithParameters(DELETE_TEMPLATE_MODAL_BODY, template.name)}
        isVisible={isConfirmModalVisible}
        onConfirmPressed={onConfirmedPressed}
        onCancel={closeSheet}
      />

      <View>
        <Text style={styles.title} numberOfLines={2}>
          {template.name}
        </Text>

        <Text style={styles.tagline} numberOfLines={1}>
          {template.tagline}
        </Text>

        <TouchableOpacity onPress={handleDeletePressed} activeOpacity={0.7} style={styles.deleteContainer}>
          <Ionicons name="trash-bin-outline" size={20} color={useStyleTheme().colors.error} />

          <Text style={styles.deleteText}>{DELETE_BUTTON_TEXT}</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default DeleteTemplateBottomSheet

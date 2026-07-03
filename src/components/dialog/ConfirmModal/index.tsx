import React, {useEffect} from 'react'

import {View} from 'react-native'

import {Theme} from '@styles/theme'
import * as Haptics from 'expo-haptics'
import Modal from 'react-native-modal'

import PrimaryButton from '@components/PrimaryButton'
import Text from '@components/Text'

import {CANCEL_BUTTON_TEXT, DELETE_BUTTON_TEXT} from '@constants/strings'

import styles, {confirmButtonBackground} from './index.styled'

interface Props {
  confirmationTitle: string
  confirmationBody: string
  confirmButtonText?: string
  confirmButtonColor?: string
  cancelButtonColor?: string
  isVisible: boolean
  onConfirmPressed: () => void
  onCancel: () => void
}

const ConfirmModal = (props: Props) => {
  const {
    confirmationTitle,
    confirmationBody,
    confirmButtonText = DELETE_BUTTON_TEXT,
    confirmButtonColor = Theme.colors.error,
    cancelButtonColor = Theme.colors.accentGreen,
    isVisible,
    onConfirmPressed,
    onCancel
  } = props

  useEffect(() => {
    if (isVisible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }, [isVisible])

  return (
    <Modal
      useNativeDriverForBackdrop={true}
      animationIn="pulse"
      backdropOpacity={0.5}
      animationOut="fadeOut"
      animationInTiming={300}
      animationOutTiming={100}
      isVisible={isVisible}
      onBackdropPress={() => {
        onCancel()
      }}>
      <View style={styles.container} pointerEvents="box-none">
        <View style={styles.modalCard}>
          <Text style={styles.title}>{confirmationTitle}</Text>

          <Text style={styles.body}>{confirmationBody}</Text>

          <View style={styles.buttonRow}>
            <PrimaryButton
              width="48%"
              style={[styles.button, confirmButtonBackground(cancelButtonColor)]}
              label={CANCEL_BUTTON_TEXT}
              onPress={() => {
                onCancel()
              }}
            />

            <PrimaryButton
              width="48%"
              style={[styles.button, confirmButtonBackground(confirmButtonColor)]}
              label={confirmButtonText}
              onPress={() => {
                onConfirmPressed()
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmModal

import React, {useState} from 'react'

import {FontAwesome5} from '@expo/vector-icons'
import useUserData from '@store/userData/useUserData'
import {Theme} from '@styles/theme'
import {showToast} from '@components/toast/util/ShowToast'

import {
  CURRENT_WEIGHT_MODAL_BODY,
  CURRENT_WEIGHT_MODAL_BUTTON,
  CURRENT_WEIGHT_MODAL_ERROR,
  CURRENT_WEIGHT_MODAL_TITLE,
  TOAST_WEIGHT_UPDATED
} from '@constants/strings'

import BaseModalProps from '../BaseInputModalProps'
import InputModal from '../InputModal'
import {isNumber} from '../../../utility/TextUtility'
import styles from './index.styled'

const WeightEntryModal = (props: BaseModalProps) => {
  const {isVisible, onDismissed} = props

  const {setCurrentWeight, currentWeight} = useUserData()

  const [value, setValue] = useState(currentWeight.toString())
  const [showError, setShowError] = useState(false)

  const onPrimaryButtonPressed = () => {
    const intVal = parseInt(value, 10)

    if (!isNumber(value) || intVal === 0) {
      setShowError(true)

      return
    }

    onDismissed()
    setShowError(false)

    setCurrentWeight(intVal)
    showToast('success', TOAST_WEIGHT_UPDATED, value)
  }

  return (
    <InputModal
      title={CURRENT_WEIGHT_MODAL_TITLE}
      subtitle={CURRENT_WEIGHT_MODAL_BODY}
      icon={
        <FontAwesome5 name="weight" size={96} style={styles.icon} color={Theme.colors.secondaryLighter} />
      }
      value={value}
      isVisible={isVisible}
      onCancel={onDismissed}
      buttonText={CURRENT_WEIGHT_MODAL_BUTTON}
      onChangeText={setValue}
      showError={showError}
      errorMessage={CURRENT_WEIGHT_MODAL_ERROR}
      keyboardType="number-pad"
      maxInputLength={3}
      onButtonPressed={onPrimaryButtonPressed}
    />
  )
}

export default WeightEntryModal

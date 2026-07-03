import React, {useEffect, useState} from 'react'

import {MaterialCommunityIcons} from '@expo/vector-icons'
import useUserData from '@store/userData/useUserData'
import {Theme} from '@styles/theme'
import {
  TARGET_WORKOUTS_MODAL_BODY,
  TARGET_WORKOUTS_MODAL_BUTTON,
  TARGET_WORKOUTS_MODAL_ERROR,
  TARGET_WORKOUTS_MODAL_TITLE,
  TOAST_TARGET_WORKOUTS_SET
} from '@constants/strings'

import BaseInputModalProps from '../BaseInputModalProps'
import InputModal from '../InputModal'
import {isNumber} from '../../../utility/TextUtility'
import {showToast} from '../../toast/util/ShowToast'
import styles from './index.styled'

const TargetWorkoutsModal = (props: BaseInputModalProps) => {
  const {isVisible, onDismissed} = props

  const {setTargetWorkouts, targetWorkouts} = useUserData()

  const [value, setValue] = useState(targetWorkouts.toString())
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    setValue(targetWorkouts.toString())
  }, [targetWorkouts])

  const onPrimaryButtonPressed = () => {
    const intVal = parseInt(value, 10)

    if (!isNumber(value) || intVal === 0 || intVal > 7) {
      setShowError(true)

      return
    }

    onDismissed()
    setShowError(false)

    setTargetWorkouts(intVal)
    showToast('success', TOAST_TARGET_WORKOUTS_SET, value)
  }

  return (
    <InputModal
      title={TARGET_WORKOUTS_MODAL_TITLE}
      subtitle={TARGET_WORKOUTS_MODAL_BODY}
      icon={
        <MaterialCommunityIcons
          style={styles.icon}
          name="weight-lifter"
          size={96}
          color={Theme.colors.secondaryLighter}
        />
      }
      value={value}
      isVisible={isVisible}
      onCancel={onDismissed}
      buttonText={TARGET_WORKOUTS_MODAL_BUTTON}
      onChangeText={setValue}
      showError={showError}
      errorMessage={TARGET_WORKOUTS_MODAL_ERROR}
      keyboardType="number-pad"
      maxInputLength={1}
      onButtonPressed={onPrimaryButtonPressed}
    />
  )
}

export default TargetWorkoutsModal

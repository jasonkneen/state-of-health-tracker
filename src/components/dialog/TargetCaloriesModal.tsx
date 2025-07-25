import React, {useEffect, useState} from 'react'

import {MaterialCommunityIcons} from '@expo/vector-icons'
import useUserData from '@store/userData/useUserData'
import {useStyleTheme} from '@theme/Theme'

import {showToast} from '@components/toast/util/ShowToast'

import {
  TARGET_CALORIE_MODAL_BODY,
  TARGET_CALORIE_MODAL_BUTTON,
  TARGET_CALORIE_MODAL_ERROR,
  TARGET_CALORIE_MODAL_TITLE,
  TOAST_TARGET_CALORIES_SET
} from '@constants/Strings'

import BaseInputModalProps from './BaseInputModalProps'
import InputModal from './InputModal'
import {isNumber} from '../../utility/TextUtility'

const TargetCaloriesModal = (props: BaseInputModalProps) => {
  const {isVisible, onDismissed} = props

  const {setTargetCalories, targetCalories} = useUserData()

  const [value, setValue] = useState(targetCalories.toString())
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    setValue(targetCalories.toString())
  }, [targetCalories])

  const onPrimaryButtonPressed = () => {
    if (!isNumber(value) || parseInt(value, 10) <= 0) {
      setShowError(true)

      return
    }

    onDismissed()
    setShowError(false)

    setTargetCalories(parseInt(value, 10))
    showToast('success', TOAST_TARGET_CALORIES_SET, value)
  }

  return (
    <InputModal
      title={TARGET_CALORIE_MODAL_TITLE}
      subtitle={TARGET_CALORIE_MODAL_BODY}
      icon={
        <MaterialCommunityIcons
          style={{alignSelf: 'center'}}
          name="fire"
          size={96}
          color={useStyleTheme().colors.fireOrange}
        />
      }
      value={value ?? targetCalories.toString()}
      isVisible={isVisible}
      onCancel={onDismissed}
      buttonText={TARGET_CALORIE_MODAL_BUTTON}
      onChangeText={setValue}
      showError={showError}
      errorMessage={TARGET_CALORIE_MODAL_ERROR}
      keyboardType="number-pad"
      maxInputLength={4}
      onButtonPressed={onPrimaryButtonPressed}
    />
  )
}

export default TargetCaloriesModal

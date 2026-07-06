import React, {useEffect, useState} from 'react'

import {MaterialCommunityIcons} from '@expo/vector-icons'
import useUserData from '@store/userData/useUserData'
import {Theme} from '@styles/theme'
import {isNumber} from '@utility/TextUtility'

import {
  STEP_GOAL_MODAL_BODY,
  STEP_GOAL_MODAL_BUTTON,
  STEP_GOAL_MODAL_ERROR,
  STEP_GOAL_MODAL_TITLE
} from '@constants/strings'

import BaseInputModalProps from '../BaseInputModalProps'
import InputModal from '../InputModal'
import styles from './index.styled'

const MAX_STEP_GOAL_DIGITS = 5

const StepGoalModal = (props: BaseInputModalProps) => {
  const {isVisible, onDismissed} = props

  const stepGoal = useUserData(state => state.stepGoal)
  const setStepGoal = useUserData(state => state.setStepGoal)

  const [value, setValue] = useState(stepGoal.toString())
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    setValue(stepGoal.toString())
  }, [stepGoal])

  const onPrimaryButtonPressed = () => {
    if (!isNumber(value) || parseInt(value, 10) <= 0) {
      setShowError(true)

      return
    }

    onDismissed()
    setShowError(false)

    setStepGoal(parseInt(value, 10))
  }

  return (
    <InputModal
      title={STEP_GOAL_MODAL_TITLE}
      subtitle={STEP_GOAL_MODAL_BODY}
      icon={<MaterialCommunityIcons style={styles.icon} name="walk" size={96} color={Theme.colors.accentGreen} />}
      value={value ?? stepGoal.toString()}
      isVisible={isVisible}
      onCancel={onDismissed}
      buttonText={STEP_GOAL_MODAL_BUTTON}
      onChangeText={setValue}
      showError={showError}
      errorMessage={STEP_GOAL_MODAL_ERROR}
      keyboardType="number-pad"
      maxInputLength={MAX_STEP_GOAL_DIGITS}
      onButtonPressed={onPrimaryButtonPressed}
    />
  )
}

export default StepGoalModal

import React, {useEffect, useState} from 'react'

import {MaterialCommunityIcons} from '@expo/vector-icons'
import useUserData from '@store/userData/useUserData'
import {Theme} from '@styles/theme'

import {showToast} from '@components/toast/util/ShowToast'

import {
  GOAL_WEIGHT_MODAL_BODY,
  GOAL_WEIGHT_MODAL_BUTTON,
  GOAL_WEIGHT_MODAL_ERROR,
  GOAL_WEIGHT_MODAL_TITLE,
  TOAST_GOAL_WEIGHT_SET
} from '@constants/strings'

import BaseInputModalProps from '../BaseInputModalProps'
import InputModal from '../InputModal'
import styles from './index.styled'

const MAX_GOAL_INPUT_LENGTH = 5

const GoalWeightModal = (props: BaseInputModalProps) => {
  const {isVisible, onDismissed} = props

  const goalWeight = useUserData(state => state.goalWeight)
  const setGoalWeight = useUserData(state => state.setGoalWeight)

  const [value, setValue] = useState(goalWeight?.toString() ?? '')
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    setValue(goalWeight?.toString() ?? '')
  }, [goalWeight])

  const onPrimaryButtonPressed = () => {
    const parsed = parseFloat(value)

    if (!Number.isFinite(parsed) || parsed <= 0) {
      setShowError(true)

      return
    }

    onDismissed()
    setShowError(false)

    const rounded = Math.round(parsed * 10) / 10

    setGoalWeight(rounded)
    showToast('success', TOAST_GOAL_WEIGHT_SET, rounded.toString())
  }

  return (
    <InputModal
      title={GOAL_WEIGHT_MODAL_TITLE}
      subtitle={GOAL_WEIGHT_MODAL_BODY}
      icon={<MaterialCommunityIcons style={styles.icon} name="bullseye-arrow" size={96} color={Theme.colors.teal} />}
      value={value}
      isVisible={isVisible}
      onCancel={onDismissed}
      buttonText={GOAL_WEIGHT_MODAL_BUTTON}
      onChangeText={setValue}
      showError={showError}
      errorMessage={GOAL_WEIGHT_MODAL_ERROR}
      keyboardType="decimal-pad"
      maxInputLength={MAX_GOAL_INPUT_LENGTH}
      onButtonPressed={onPrimaryButtonPressed}
    />
  )
}

export default GoalWeightModal

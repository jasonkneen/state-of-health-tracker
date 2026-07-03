import React, {useEffect, useState} from 'react'

import {ActivityIndicator, TouchableOpacity, View} from 'react-native'

import {Theme} from '@styles/theme'

import ConfirmModal from '@components/dialog/ConfirmModal'
import Text from '@components/Text'

import {COMPLETE_BUTTON_TEXT, COMPLETE_WORKOUT_MODAL_BODY, COMPLETE_WORKOUT_MODAL_TITLE} from '@constants/strings'

import styles from './index.styled'

const formatElapsed = (elapsedMs: number) => {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (value: number) => value.toString().padStart(2, '0')

  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`
}

interface Props {
  readonly startedAt: number
  readonly isCompleting: boolean
  readonly onCompletePressed: () => void
}

const CompleteWorkoutPanel = (props: Props) => {
  const {startedAt, isCompleting, onCompletePressed} = props

  const [now, setNow] = useState(() => Date.now())
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <ConfirmModal
        confirmationTitle={COMPLETE_WORKOUT_MODAL_TITLE}
        confirmationBody={COMPLETE_WORKOUT_MODAL_BODY}
        confirmButtonText={COMPLETE_BUTTON_TEXT}
        confirmButtonColor={Theme.colors.accentGreen}
        cancelButtonColor={Theme.colors.track}
        isVisible={isConfirmModalVisible}
        onConfirmPressed={() => {
          setIsConfirmModalVisible(false)
          onCompletePressed()
        }}
        onCancel={() => setIsConfirmModalVisible(false)}
      />

      <TouchableOpacity
        style={styles.timerPill}
        activeOpacity={0.7}
        disabled={isCompleting}
        onPress={() => setIsConfirmModalVisible(true)}>
        {isCompleting ? (
          <ActivityIndicator size="small" color={Theme.colors.accentGreen} />
        ) : (
          <>
            <View style={styles.recordingDot} />

            <Text style={styles.timerText}>{formatElapsed(now - startedAt)}</Text>
          </>
        )}
      </TouchableOpacity>
    </>
  )
}

export default CompleteWorkoutPanel

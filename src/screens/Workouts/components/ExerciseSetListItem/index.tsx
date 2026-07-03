import React, {useState} from 'react'

import {TouchableOpacity, View} from 'react-native'

import {Exercise} from '@data/models/Exercise'
import {ExerciseSet} from '@data/models/ExerciseSet'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'
import * as Haptics from 'expo-haptics'
import {Swipeable} from 'react-native-gesture-handler'
import Animated, {useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming} from 'react-native-reanimated'

import CheckIcon from '@components/icons/CheckIcon'
import SwipeDeleteListItem from '@components/SwipeDeleteListItem'
import Text from '@components/Text'
import TextInput from '@components/TextInput'

import {ADD_SET_BUTTON_TEXT} from '@constants/strings'

import styles from './index.styled'
import {
  emptyFieldTexts,
  formatSetFieldInputText,
  getSetFieldsForLoggingType,
  parseSetFieldText,
  SetFieldKey,
  setFieldToDisplayText
} from '../../../../utility/exerciseSetFields'

interface Props {
  readonly exercise: Exercise
  readonly set: ExerciseSet
  readonly index: number
  readonly swipeableRef: (ref: Swipeable) => void
  readonly onSwipeActivated: () => void
  readonly onDeletePressed: () => void
}

const ExerciseSetListItem = (props: Props) => {
  const {exercise, set, index, swipeableRef, onSwipeActivated, onDeletePressed} = props

  const {completeSet} = useDailyWorkoutEntryStore()

  const checkScale = useSharedValue(1)

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: checkScale.value}]
  }))

  const fields = getSetFieldsForLoggingType(exercise.loggingType)

  const [fieldTexts, setFieldTexts] = useState<Record<SetFieldKey, string>>(() => emptyFieldTexts(set))
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<SetFieldKey, boolean>>>({})

  // History may have fewer sets than today's workout, so sets past the end
  // fall back to the last set of the previous session
  const previousSets = exercise.latestCompletedSets
  const previousSet = previousSets.length > 0 ? previousSets[Math.min(index, previousSets.length - 1)] : undefined

  const onFieldTextChanged = (key: SetFieldKey, text: string) => {
    setFieldErrors(previous => ({...previous, [key]: false}))
    setFieldTexts(previous => ({...previous, [key]: formatSetFieldInputText(key, text)}))
  }

  const completeSetChecked = (isChecked: boolean) => {
    const values: Partial<Record<SetFieldKey, number>> = {}
    const errors: Partial<Record<SetFieldKey, boolean>> = {}
    let hasError = false

    fields.forEach(field => {
      let value = parseSetFieldText(field.key, fieldTexts[field.key])

      if (value === undefined) {
        const previousValue = previousSet?.[field.key]

        if (previousValue !== undefined && previousValue !== null) {
          value = previousValue
          setFieldTexts(current => ({...current, [field.key]: setFieldToDisplayText(field.key, previousValue) ?? ''}))
        }
      }

      if (field.required && value === undefined) {
        errors[field.key] = true
        hasError = true
      } else if (value !== undefined) {
        values[field.key] = value
      }
    })

    setFieldErrors(errors)

    if (hasError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

      return
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    checkScale.value = withSequence(withTiming(0.7, {duration: 30}), withSpring(1, {damping: 38, stiffness: 900}))
    completeSet(exercise, set.id, isChecked, values)
  }

  return (
    <View key={set.id} style={styles.container}>
      {index === 0 && (
        <View style={styles.headerRow}>
          <Text style={[styles.headerLabel, styles.headerLabelSet]}>{ADD_SET_BUTTON_TEXT}</Text>

          {fields.map(field => (
            <Text key={field.key} style={[styles.headerLabel, styles.headerLabelCell]}>
              {field.label}
            </Text>
          ))}

          <View style={styles.headerLabelSpacer} />
        </View>
      )}

      <SwipeDeleteListItem
        deleteIconRightMargin={Spacing.MEDIUM}
        swipeableRef={swipeableRef}
        onSwipeActivated={onSwipeActivated}
        onDeletePressed={onDeletePressed}>
        <View style={styles.row}>
          <Text style={styles.setNumber}>{index + 1}</Text>

          {fields.map(field => (
            <TextInput
              key={field.key}
              selectTextOnFocus={true}
              value={fieldTexts[field.key]}
              onChangeText={text => onFieldTextChanged(field.key, text)}
              editable={!set.completed}
              placeholder={
                (previousSet ? setFieldToDisplayText(field.key, previousSet[field.key]) : undefined) ??
                (field.key === 'durationSeconds' ? '0:00' : undefined)
              }
              contextMenuHidden={true}
              textAlign="center"
              maxLength={field.key === 'distanceMeters' ? 6 : field.key === 'durationSeconds' ? 5 : 4}
              style={[
                styles.cellInput,
                set.completed && styles.cellInputCompleted,
                fieldErrors[field.key] && styles.cellInputError
              ]}
              keyboardType={field.key === 'distanceMeters' ? 'decimal-pad' : 'number-pad'}
            />
          ))}

          <View style={styles.checkColumn}>
            <Animated.View style={checkAnimatedStyle}>
              <TouchableOpacity
                style={[styles.checkCircle, set.completed && styles.checkCircleDone]}
                activeOpacity={0.6}
                onPress={() => completeSetChecked(!set.completed)}>
                {set.completed && <CheckIcon color={Theme.colors.white} />}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </SwipeDeleteListItem>
    </View>
  )
}

export default ExerciseSetListItem

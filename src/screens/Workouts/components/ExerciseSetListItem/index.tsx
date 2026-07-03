import React, {useState} from 'react'

import {TouchableOpacity, View} from 'react-native'

import {Exercise} from '@data/models/Exercise'
import {ExerciseSet} from '@data/models/ExerciseSet'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'
import * as Haptics from 'expo-haptics'
import {Swipeable} from 'react-native-gesture-handler'

import CheckIcon from '@components/icons/CheckIcon'
import SwipeDeleteListItem from '@components/SwipeDeleteListItem'
import Text from '@components/Text'
import TextInput from '@components/TextInput'

import {ADD_SET_BUTTON_TEXT, LBS_LABEL, REPS_LABEL} from '@constants/strings'

import styles from './index.styled'

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

  const [weightText, setWeightText] = useState(set.weight?.toString() ?? '')
  const [repsText, setRepsText] = useState(set.reps?.toString() ?? '')
  const [weightInputError, setWeightInputError] = useState(false)
  const [repsInputError, setRepsInputError] = useState(false)

  const completeSetChecked = (isChecked: boolean) => {
    let weight

    if (weightText !== '') {
      weight = parseInt(weightText, 10)
    } else {
      weight = exercise.latestCompletedSets[index]?.weight
      if (weight) {
        setWeightText(weight.toString())
      }
    }

    let reps

    if (repsText !== '') {
      reps = parseInt(repsText, 10)
    } else {
      reps = exercise.latestCompletedSets[index]?.reps
      if (reps) {
        setRepsText(reps.toString())
      }
    }

    setWeightInputError(weight === undefined)
    setRepsInputError(reps === undefined)

    if (weight === undefined || reps === undefined) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

      return
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    completeSet(exercise, set.id, isChecked, weight, reps)
  }

  const onWeightTextChanged = (text: string) => {
    setWeightInputError(false)
    setWeightText(text)
  }

  const onRepsTextChanged = (text: string) => {
    setRepsInputError(false)
    setRepsText(text)
  }

  return (
    <View key={set.id} style={styles.container}>
      {index === 0 && (
        <View style={styles.headerRow}>
          <Text style={[styles.headerLabel, styles.headerLabelSet]}>{ADD_SET_BUTTON_TEXT}</Text>

          <Text style={[styles.headerLabel, styles.headerLabelCell]}>{LBS_LABEL}</Text>

          <Text style={[styles.headerLabel, styles.headerLabelCell]}>{REPS_LABEL}</Text>

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

          <TextInput
            selectTextOnFocus={true}
            value={weightText}
            onChangeText={onWeightTextChanged}
            editable={!set.completed}
            placeholder={exercise.latestCompletedSets[index]?.weight?.toString()}
            returnKeyType="done"
            contextMenuHidden={true}
            textAlign="center"
            maxLength={4}
            style={[
              styles.cellInput,
              set.completed && styles.cellInputCompleted,
              weightInputError && styles.cellInputError
            ]}
            keyboardType="number-pad"
          />

          <TextInput
            selectTextOnFocus={true}
            value={repsText}
            onChangeText={onRepsTextChanged}
            editable={!set.completed}
            placeholder={exercise.latestCompletedSets[index]?.reps?.toString()}
            returnKeyType="done"
            contextMenuHidden={true}
            textAlign="center"
            maxLength={4}
            style={[
              styles.cellInput,
              set.completed && styles.cellInputCompleted,
              repsInputError && styles.cellInputError
            ]}
            keyboardType="number-pad"
          />

          <View style={styles.checkColumn}>
            <TouchableOpacity
              style={[styles.checkCircle, set.completed && styles.checkCircleDone]}
              activeOpacity={0.6}
              onPress={() => completeSetChecked(!set.completed)}>
              {set.completed && <CheckIcon color={Theme.colors.white} />}
            </TouchableOpacity>
          </View>
        </View>
      </SwipeDeleteListItem>
    </View>
  )
}

export default ExerciseSetListItem

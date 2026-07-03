import React, {useState} from 'react'

import {DailyExercise} from '@data/models/DailyExercise'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import {formatExerciseSubtitle} from '@utility/formatExerciseSubtitle'

import SectionListHeader from '@components/SectionListHeader'

import {ADD_SET_BUTTON_TEXT} from '@constants/strings'

import ExerciseListItemDropdown from './ExerciseListItemDropdown'

interface Props {
  dailyExercise: DailyExercise
  onReorganizePressed: () => void
}

const ExerciseSectionListHeader = (props: Props) => {
  const {dailyExercise, onReorganizePressed} = props

  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [dropdownTopMargin, setDropdownTopMargin] = useState(0)
  const [dropdownDailyExercise, setDropdownDailyExercise] = useState<DailyExercise>()

  const {addSet} = useDailyWorkoutEntryStore()

  const dropdown = () => (
    <ExerciseListItemDropdown
      onDropdownCancel={isVisible => {
        setIsDropdownVisible(isVisible)
      }}
      isVisible={isDropdownVisible}
      dropdownTopMargin={dropdownTopMargin}
      dailyExerciseToDelete={dropdownDailyExercise}
      onReorganize={onReorganizePressed}
    />
  )

  return (
    <>
      {dropdown()}

      <SectionListHeader
        key={dailyExercise.id}
        title={dailyExercise.exercise.name}
        subtitle={formatExerciseSubtitle(dailyExercise.exercise.exerciseType, dailyExercise.exercise.exerciseBodyPart)}
        onTitlePressed={(topMargin?: number) => {
          if (topMargin) {
            setDropdownTopMargin(topMargin)
          }
          setDropdownDailyExercise(dailyExercise)
          setIsDropdownVisible(true)
        }}
        buttonText={ADD_SET_BUTTON_TEXT}
        onButtonPressed={() => {
          addSet(dailyExercise.exercise)
        }}
      />
    </>
  )
}

export default ExerciseSectionListHeader

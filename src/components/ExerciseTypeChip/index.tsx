import React from 'react'

import {View} from 'react-native'

import {ExerciseTypeEnum} from '@data/models/Exercise'
import {Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import {Theme} from '@styles/theme'

import styles from './index.styled'

interface Props {
  exerciseType: ExerciseTypeEnum
}

const ExerciseTypeChip = (props: Props) => {
  const {exerciseType} = props

  const getIcon = () => {
    switch (exerciseType) {
      case ExerciseTypeEnum.DUMBBELL:
        return <MaterialCommunityIcons name="dumbbell" size={24} color={Theme.colors.white} />
      case ExerciseTypeEnum.BODYWEIGHT:
        return <MaterialCommunityIcons name="weight-lifter" size={24} color={Theme.colors.white} />
      case ExerciseTypeEnum.CABLE:
        return <MaterialCommunityIcons name="jump-rope" size={24} color={Theme.colors.white} />
      case ExerciseTypeEnum.WEIGHTED:
        return <FontAwesome5 style={styles.weightedIcon} name="weight-hanging" size={20} color={Theme.colors.white} />
      case ExerciseTypeEnum.MACHINE:
        return <MaterialCommunityIcons name="stairs-up" size={24} color={Theme.colors.white} />
      case ExerciseTypeEnum.KETTLEBELL:
        return <MaterialCommunityIcons name="kettlebell" size={28} color={Theme.colors.white} />
      case ExerciseTypeEnum.TIMED:
        return <Entypo name="stopwatch" size={24} color={Theme.colors.white} />
      case ExerciseTypeEnum.BARBELL:
      default:
        return <Ionicons style={styles.barbellIcon} name="barbell" size={24} color={Theme.colors.white} />
    }
  }

  return <View style={styles.container}>{getIcon()}</View>
}

export default ExerciseTypeChip

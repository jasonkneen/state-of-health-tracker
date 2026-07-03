import React from 'react'

import {TouchableOpacity} from 'react-native'

import {DailyExercise} from '@data/models/DailyExercise'
import {Ionicons} from '@expo/vector-icons'
import {Theme} from '@styles/theme'
import * as Haptics from 'expo-haptics'
import DraggableFlatList, {RenderItemParams, ScaleDecorator} from 'react-native-draggable-flatlist'

import Text from '@components/Text'

import styles from './index.styled'

interface Props {
  readonly dailyExercises: DailyExercise[]
  readonly onReorder: (dailyExercises: DailyExercise[]) => void
  readonly listHeader?: React.ReactElement
}

const ReorganizeExerciseList = (props: Props) => {
  const {dailyExercises, onReorder, listHeader} = props

  const setCountLabel = (dailyExercise: DailyExercise) =>
    dailyExercise.sets.length === 1 ? '1 set' : `${dailyExercise.sets.length} sets`

  const renderItem = ({item, drag, isActive}: RenderItemParams<DailyExercise>) => (
    <ScaleDecorator activeScale={1.04}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        delayLongPress={100}
        onLongPress={drag}
        disabled={isActive}>
        <Ionicons name="reorder-three" size={24} color={Theme.colors.textSecondary} />

        <Text numberOfLines={1} style={styles.cardTitle}>
          {item.exercise.name}
        </Text>

        <Text style={styles.setCount}>{setCountLabel(item)}</Text>
      </TouchableOpacity>
    </ScaleDecorator>
  )

  return (
    <DraggableFlatList
      containerStyle={styles.listContainer}
      data={dailyExercises}
      keyExtractor={item => item.id}
      ListHeaderComponent={listHeader}
      onDragBegin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
      onPlaceholderIndexChange={() => Haptics.selectionAsync()}
      onDragEnd={({data}) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onReorder(data)
      }}
      renderItem={renderItem}
    />
  )
}

export default ReorganizeExerciseList

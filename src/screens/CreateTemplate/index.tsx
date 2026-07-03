import React, {useState} from 'react'

import {FlatList, ListRenderItemInfo, ScrollView, TouchableOpacity, View} from 'react-native'

import {Exercise} from '@data/models/Exercise'
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {useCreateTemplateMutation} from '@queries/templates/useCreateTemplateMutation'
import {useNavigation} from '@react-navigation/native'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'
import {filterExercises} from '@utility/filterExercises'
import {formatExerciseSubtitle} from '@utility/formatExerciseSubtitle'
import * as Haptics from 'expo-haptics'
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated'

import ExerciseTypeChip from '@components/ExerciseTypeChip'
import FloatingActionButton from '@components/FloatingActionButton'
import ListItem from '@components/ListItem'
import LoadingOverlay from '@components/LoadingOverlay'
import SearchBar from '@components/SearchBar'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import {
  CREATE_TEMPLATE_NO_EXERCISES,
  SEARCH_EXERCISES_PLACEHOLDER,
  SELECT_EXERCISES_FOR_TEMPLATE_TITLE,
  TOAST_TEMPLATE_CREATED,
  TOAST_TEMPLATE_CREATION_ERROR
} from '@constants/strings'

import CreateTemplateModal from './components/CreateTemplateModal'
import styles from './index.styled'

const FAB_TRANSITION_MS = 200

const CreateTemplateScreen = () => {
  const {goBack} = useNavigation()

  const {data: allExercises = []} = useExercisesQuery()
  const {mutateAsync: createTemplate, isPending: isCreatingTemplate} = useCreateTemplateMutation()

  const [searchFilter, setSearchFilter] = useState('')
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  const exercises = filterExercises(allExercises, searchFilter)

  const selectionIndex = (exercise: Exercise) => selectedExercises.findIndex(e => e.id === exercise.id)

  const toggleExercise = (exercise: Exercise) => {
    Haptics.selectionAsync()
    setSelectedExercises(prev =>
      prev.some(e => e.id === exercise.id) ? prev.filter(e => e.id !== exercise.id) : [...prev, exercise]
    )
  }

  const renderSelectionCircle = (index: number) => (
    <View style={[styles.selectCircle, index >= 0 && styles.selectCircleSelected]}>
      {index >= 0 && <Text style={styles.selectCircleNumber}>{index + 1}</Text>}
    </View>
  )

  const renderItem = ({item}: ListRenderItemInfo<Exercise>) => {
    const index = selectionIndex(item)
    const selected = index >= 0

    return (
      <ListItem
        isSwipeable={false}
        leftRightMargin={Spacing.MEDIUM}
        title={item.name}
        backgroundColor={selected ? Theme.colors.tertiary : Theme.colors.background}
        subtitle={formatExerciseSubtitle(item.exerciseType, item.exerciseBodyPart)}
        leading={renderSelectionCircle(index)}
        chip={<ExerciseTypeChip exerciseType={item.exerciseType} />}
        onPress={() => toggleExercise(item)}
      />
    )
  }

  const renderSelectedTray = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      style={styles.selectedTray}
      contentContainerStyle={styles.selectedTrayContent}>
      {selectedExercises.map(exercise => (
        <TouchableOpacity
          key={exercise.id}
          style={styles.selectedChip}
          activeOpacity={0.7}
          onPress={() => toggleExercise(exercise)}>
          <Text style={styles.selectedChipText} numberOfLines={1}>
            {exercise.name}
          </Text>

          <Ionicons name="close" size={14} color={Theme.colors.textSecondary} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  )

  const onFinishSelectionPressed = () => {
    if (selectedExercises.length > 0) setIsModalVisible(true)
  }

  const handleCreate = async (name: string, tagline: string) => {
    setIsModalVisible(false)

    try {
      const created = await createTemplate({
        name,
        tagline,
        exerciseIds: selectedExercises.map(e => e.id)
      })

      goBack()
      showToast('success', TOAST_TEMPLATE_CREATED, created.name)
    } catch (error) {
      showToast('error', TOAST_TEMPLATE_CREATION_ERROR)
    }
  }

  return (
    <View style={styles.container}>
      {isCreatingTemplate && <LoadingOverlay />}

      <CreateTemplateModal
        isVisible={isModalVisible}
        exercises={selectedExercises}
        onDismissed={() => setIsModalVisible(false)}
        handleCreate={handleCreate}
      />

      <FlatList
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        initialNumToRender={10}
        data={exercises}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <SearchBar placeholder={SEARCH_EXERCISES_PLACEHOLDER} onSearchTextChanged={setSearchFilter} />

            {selectedExercises.length > 0 && renderSelectedTray()}

            <Text style={styles.headerText}>{SELECT_EXERCISES_FOR_TEMPLATE_TITLE}</Text>
          </>
        }
        ListEmptyComponent={
          <>
            <MaterialCommunityIcons style={styles.emptyIcon} name="kettlebell" size={100} color={Theme.colors.white} />

            <Text style={styles.emptyText}>{CREATE_TEMPLATE_NO_EXERCISES}</Text>
          </>
        }
        renderItem={renderItem}
      />

      {selectedExercises.length > 0 && (
        <Animated.View
          style={styles.fabContainer}
          entering={ZoomIn.duration(FAB_TRANSITION_MS)}
          exiting={ZoomOut.duration(FAB_TRANSITION_MS)}>
          <FloatingActionButton onPress={onFinishSelectionPressed}>
            <Ionicons name="checkmark" size={28} color={Theme.colors.onInverse} />
          </FloatingActionButton>
        </Animated.View>
      )}
    </View>
  )
}

export default CreateTemplateScreen

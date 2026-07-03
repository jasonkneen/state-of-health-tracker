import React, {useState} from 'react'

import {ScrollView, SectionList, SectionListRenderItem, TouchableOpacity, View} from 'react-native'

import {mapExerciseType} from '@data/converters/ExerciseConverter'
import {CreateExercisePayload, Exercise, isExerciseObject} from '@data/models/Exercise'
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import {useExerciseCatalogSearch} from '@hooks/useExerciseCatalogSearch'
import {Navigation} from '@navigation/types'
import {useCreateExerciseMutation} from '@queries/exercises/useCreateExerciseMutation'
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
import SecondaryButton from '@components/SecondaryButton'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import Screens from '@constants/screens'
import {
  CREATE_EXERCISE_BUTTON_TEXT,
  CREATE_TEMPLATE_NO_EXERCISES,
  FROM_CATALOG_HEADER,
  NO_SEARCH_RESULTS_TEXT,
  SEARCH_EXERCISES_PLACEHOLDER,
  SELECT_EXERCISES_FOR_TEMPLATE_TITLE,
  TOAST_TEMPLATE_CREATION_ERROR,
  YOUR_EXERCISES_HEADER
} from '@constants/strings'

import CreateTemplateModal from './components/CreateTemplateModal'
import styles from './index.styled'

const FAB_TRANSITION_MS = 200

// Catalog picks aren't on the user's account yet, so selection holds payloads
// alongside saved exercises until the template is created
type SelectableExercise = Exercise | CreateExercisePayload

interface Section {
  title: string
  data: SelectableExercise[]
}

const CreateTemplateScreen = () => {
  const {goBack, push} = useNavigation<Navigation>()

  const {data: allExercises = []} = useExercisesQuery()
  const {mutateAsync: createTemplate, isPending: isCreatingTemplate} = useCreateTemplateMutation()
  const {mutateAsync: createExercise, isPending: isCreatingExercise} = useCreateExerciseMutation()

  const {searchTerm, isSearching, catalogResults, setSearchText, loadMoreCatalogResults} = useExerciseCatalogSearch()

  const [selectedExercises, setSelectedExercises] = useState<SelectableExercise[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  const isUpdating = isCreatingTemplate || isCreatingExercise

  const matchingExercises = filterExercises(allExercises, searchTerm)

  // Catalog entries the user already owns show up under "Your Exercises", so
  // drop them from the catalog section instead of listing them twice
  const ownedExerciseKeys = new Set(allExercises.map(e => `${e.name.toLowerCase()}|${e.exerciseType}`))
  const catalogSuggestions = catalogResults.filter(
    payload => !ownedExerciseKeys.has(`${payload.name.toLowerCase()}|${mapExerciseType(payload.exerciseType)}`)
  )

  const hasSearchResults = matchingExercises.length > 0 || catalogSuggestions.length > 0

  // Empty sections fall through to ListEmptyComponent instead of
  // rendering headers over a blank list
  const sections: Section[] = isSearching
    ? hasSearchResults
      ? [
          ...(matchingExercises.length > 0
            ? [{title: YOUR_EXERCISES_HEADER, data: matchingExercises as SelectableExercise[]}]
            : []),
          {title: FROM_CATALOG_HEADER, data: catalogSuggestions}
        ]
      : []
    : allExercises.length > 0
      ? [{title: YOUR_EXERCISES_HEADER, data: allExercises}]
      : []

  const selectionKey = (item: SelectableExercise) =>
    isExerciseObject(item) ? item.id : `catalog:${item.name.toLowerCase()}|${mapExerciseType(item.exerciseType)}`

  const selectionIndex = (item: SelectableExercise) =>
    selectedExercises.findIndex(selected => selectionKey(selected) === selectionKey(item))

  const toggleExercise = (item: SelectableExercise) => {
    Haptics.selectionAsync()
    setSelectedExercises(prev =>
      prev.some(selected => selectionKey(selected) === selectionKey(item))
        ? prev.filter(selected => selectionKey(selected) !== selectionKey(item))
        : [...prev, item]
    )
  }

  const renderSelectionCircle = (index: number) => (
    <View style={[styles.selectCircle, index >= 0 && styles.selectCircleSelected]}>
      {index >= 0 && <Text style={styles.selectCircleNumber}>{index + 1}</Text>}
    </View>
  )

  const renderItem: SectionListRenderItem<SelectableExercise, Section> = ({item}) => {
    const index = selectionIndex(item)
    const selected = index >= 0
    const exerciseType = isExerciseObject(item) ? item.exerciseType : mapExerciseType(item.exerciseType)

    return (
      <ListItem
        isSwipeable={false}
        leftRightMargin={Spacing.MEDIUM}
        title={item.name}
        backgroundColor={selected ? Theme.colors.tertiary : Theme.colors.background}
        subtitle={formatExerciseSubtitle(item.exerciseType, item.exerciseBodyPart)}
        leading={renderSelectionCircle(index)}
        chip={<ExerciseTypeChip exerciseType={exerciseType} />}
        onPress={() => toggleExercise(item)}
      />
    )
  }

  const renderSectionHeader = (section: Section) =>
    isSearching ? (
      <>
        <View style={styles.searchSectionHeaderContainer}>
          <Text style={styles.sectionHeaderText}>{section.title}</Text>
        </View>

        {section.title === FROM_CATALOG_HEADER && section.data.length === 0 && (
          <Text style={styles.noResultsText}>{NO_SEARCH_RESULTS_TEXT}</Text>
        )}
      </>
    ) : null

  const renderSelectedTray = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      style={styles.selectedTray}
      contentContainerStyle={styles.selectedTrayContent}>
      {selectedExercises.map(exercise => (
        <TouchableOpacity
          key={selectionKey(exercise)}
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
      // Save catalog picks to the user's account first so the template can
      // reference real exercise ids, preserving the selection order
      const exerciseIds = await Promise.all(
        selectedExercises.map(item => (isExerciseObject(item) ? item.id : createExercise(item).then(e => e.id)))
      )

      await createTemplate({
        name,
        tagline,
        exerciseIds
      })

      goBack()
    } catch (error) {
      showToast('error', TOAST_TEMPLATE_CREATION_ERROR)
    }
  }

  return (
    <View style={styles.container}>
      {isUpdating && <LoadingOverlay />}

      <CreateTemplateModal
        isVisible={isModalVisible}
        exercises={selectedExercises}
        onDismissed={() => setIsModalVisible(false)}
        handleCreate={handleCreate}
      />

      <SectionList<SelectableExercise, Section>
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        initialNumToRender={10}
        sections={sections}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <SearchBar placeholder={SEARCH_EXERCISES_PLACEHOLDER} onSearchTextChanged={setSearchText} />

            {selectedExercises.length > 0 && renderSelectedTray()}

            <Text style={styles.headerText}>{SELECT_EXERCISES_FOR_TEMPLATE_TITLE}</Text>
          </>
        }
        ListEmptyComponent={
          <>
            <MaterialCommunityIcons style={styles.emptyIcon} name="kettlebell" size={100} color={Theme.colors.white} />

            <Text style={styles.emptyText}>{isSearching ? NO_SEARCH_RESULTS_TEXT : CREATE_TEMPLATE_NO_EXERCISES}</Text>
          </>
        }
        ListFooterComponent={
          <SecondaryButton
            style={styles.createFooterButton}
            label={CREATE_EXERCISE_BUTTON_TEXT}
            onPress={() => {
              push(Screens.CREATE_EXERCISE)
            }}
          />
        }
        renderSectionHeader={({section}) => renderSectionHeader(section)}
        renderItem={renderItem}
        onEndReached={loadMoreCatalogResults}
        onEndReachedThreshold={0.2}
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

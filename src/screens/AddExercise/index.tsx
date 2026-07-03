import React from 'react'

import {SectionList, SectionListRenderItem, View} from 'react-native'

import {mapExerciseType} from '@data/converters/ExerciseConverter'
import {CreateExercisePayload, Exercise, isExerciseObject} from '@data/models/Exercise'
import {ExerciseTemplate} from '@data/models/ExerciseTemplate'
import {Navigation} from '@navigation/types'
import {useCreateExerciseMutation} from '@queries/exercises/useCreateExerciseMutation'
import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {mutationKeys} from '@queries/keys'
import {useTemplatesQuery} from '@queries/templates/useTemplatesQuery'
import {useNavigation} from '@react-navigation/native'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'
import {useIsMutating} from '@tanstack/react-query'
import {formatExerciseSubtitle} from '@utility/formatExerciseSubtitle'

import ExerciseTypeChip from '@components/ExerciseTypeChip'
import {closeGlobalBottomSheet, openGlobalBottomSheet} from '@components/GlobalBottomSheet'
import ListItem from '@components/ListItem'
import LoadingOverlay from '@components/LoadingOverlay'
import SearchBar from '@components/SearchBar'
import SecondaryButton from '@components/SecondaryButton'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import Screens from '@constants/screens'
import {
  CREATE_EXERCISE_BUTTON_TEXT,
  CREATE_TEMPLATE_BUTTON_TEXT,
  FROM_CATALOG_HEADER,
  NO_EXERCISES_ADDED_TEXT,
  NO_SEARCH_RESULTS_TEXT,
  NO_TEMPLATES_ADDED_TEXT,
  SEARCH_ADD_EXERCISE_ERROR,
  SEARCH_EXERCISES_PLACEHOLDER,
  TEMPLATES_HEADER,
  TOAST_EXERCISE_ADDED,
  TOAST_EXERCISE_ALREADY_ADDED,
  YOUR_EXERCISES_HEADER
} from '@constants/strings'

import ExerciseListItem from './components/ExerciseListItem'
import ExerciseOptionsBottomSheet from './components/ExerciseOptionsBottomSheet'
import TemplateListItem from './components/TemplateListItem'
import {useExerciseCatalogSearch} from './hooks/useExerciseCatalogSearch'
import styles from './index.styled'

type SectionItem = Exercise | ExerciseTemplate | CreateExercisePayload

interface Section {
  title: string
  data: SectionItem[]
}

const AddExerciseScreen = () => {
  const {push, goBack} = useNavigation<Navigation>()

  const {searchTerm, isSearching, catalogResults, setSearchText, loadMoreCatalogResults} = useExerciseCatalogSearch()

  const {data: templates = []} = useTemplatesQuery()
  const {data: exercises = []} = useExercisesQuery()
  const {mutateAsync: createExercise, isPending: isCreatingExercise} = useCreateExerciseMutation()
  const {addDailyExercise} = useDailyWorkoutEntryStore()

  // Deletes are triggered from the global bottom sheet, so this screen reflects
  // their in-flight state through the mutation cache rather than local state
  const isDeletingExercise = useIsMutating({mutationKey: mutationKeys.deleteExercise}) > 0
  const isDeletingTemplate = useIsMutating({mutationKey: mutationKeys.deleteTemplate}) > 0
  const isUpdating = isDeletingExercise || isDeletingTemplate || isCreatingExercise

  const normalizedTerm = searchTerm.toLowerCase()
  const matchingExercises = exercises.filter(
    exercise =>
      exercise.name.toLowerCase().includes(normalizedTerm) ||
      exercise.exerciseBodyPart?.toLowerCase().includes(normalizedTerm)
  )

  // Catalog entries the user already owns show up under "Your Exercises", so
  // drop them from the catalog section instead of listing them twice
  const ownedExerciseKeys = new Set(exercises.map(e => `${e.name.toLowerCase()}|${e.exerciseType}`))
  const catalogSuggestions = catalogResults.filter(
    payload => !ownedExerciseKeys.has(`${payload.name.toLowerCase()}|${mapExerciseType(payload.exerciseType)}`)
  )

  const sections: Section[] = isSearching
    ? [
        ...(matchingExercises.length > 0
          ? [{title: YOUR_EXERCISES_HEADER, data: matchingExercises as SectionItem[]}]
          : []),
        {title: FROM_CATALOG_HEADER, data: catalogSuggestions}
      ]
    : [
        {title: TEMPLATES_HEADER, data: templates},
        {title: YOUR_EXERCISES_HEADER, data: exercises}
      ]

  const addToWorkout = (exercise: Exercise) => {
    if (addDailyExercise(exercise)) {
      showToast('success', TOAST_EXERCISE_ADDED, exercise.name)
      goBack()
    } else {
      showToast('error', TOAST_EXERCISE_ALREADY_ADDED, exercise.name)
    }
  }

  const onCatalogExercisePressed = async (payload: CreateExercisePayload) => {
    const existing = exercises.find(
      e => e.name === payload.name && e.exerciseType === mapExerciseType(payload.exerciseType)
    )

    if (existing) {
      addToWorkout(existing)

      return
    }

    try {
      const created = await createExercise(payload)

      addToWorkout(created)
    } catch {
      showToast('error', SEARCH_ADD_EXERCISE_ERROR)
    }
  }

  const renderBrowseHeader = (section: Section) => {
    const isEmpty = section.data.length === 0

    const button =
      section.title === YOUR_EXERCISES_HEADER ? (
        <SecondaryButton
          style={styles.createButton}
          label={CREATE_EXERCISE_BUTTON_TEXT}
          onPress={() => {
            push(Screens.CREATE_EXERCISE)
          }}
        />
      ) : (
        <SecondaryButton
          style={styles.createButton}
          label={CREATE_TEMPLATE_BUTTON_TEXT}
          onPress={() => {
            push(Screens.CREATE_TEMPLATE)
          }}
        />
      )

    const emptyText = isEmpty
      ? section.title === YOUR_EXERCISES_HEADER
        ? NO_EXERCISES_ADDED_TEXT
        : NO_TEMPLATES_ADDED_TEXT
      : undefined

    return (
      <>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderText}>{section.title}</Text>

          {button}
        </View>

        {emptyText && <Text style={styles.emptyText}>{emptyText}</Text>}
      </>
    )
  }

  const renderSearchHeader = (section: Section) => (
    <>
      <View style={styles.searchSectionHeaderContainer}>
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
      </View>

      {section.title === FROM_CATALOG_HEADER && section.data.length === 0 && (
        <Text style={styles.emptyText}>{NO_SEARCH_RESULTS_TEXT}</Text>
      )}
    </>
  )

  const renderItem: SectionListRenderItem<SectionItem, Section> = ({item, section}) => {
    if (section.title === FROM_CATALOG_HEADER) {
      const payload = item as CreateExercisePayload

      return (
        <ListItem
          isSwipeable={false}
          leftRightMargin={Spacing.SMALL}
          title={payload.name}
          backgroundColor={Theme.colors.background}
          subtitle={formatExerciseSubtitle(payload.exerciseType, payload.exerciseBodyPart)}
          chip={<ExerciseTypeChip exerciseType={mapExerciseType(payload.exerciseType)} />}
          onPress={() => {
            openGlobalBottomSheet(
              <ExerciseOptionsBottomSheet
                title={payload.name}
                subtitle={formatExerciseSubtitle(payload.exerciseType, payload.exerciseBodyPart)}
                onAddPressed={() => {
                  closeGlobalBottomSheet()
                  onCatalogExercisePressed(payload)
                }}
              />
            )
          }}
        />
      )
    }

    return isExerciseObject(item) ? (
      <ExerciseListItem exercise={item} />
    ) : (
      <TemplateListItem template={item as ExerciseTemplate} />
    )
  }

  const renderFooter = () =>
    isSearching ? (
      <SecondaryButton
        style={styles.createFooterButton}
        label={CREATE_EXERCISE_BUTTON_TEXT}
        onPress={() => {
          push(Screens.CREATE_EXERCISE)
        }}
      />
    ) : (
      <View style={styles.listFooter} />
    )

  return (
    <>
      {isUpdating && <LoadingOverlay />}

      <SectionList<SectionItem, Section>
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        sections={sections}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <SearchBar placeholder={SEARCH_EXERCISES_PLACEHOLDER} onSearchTextChanged={setSearchText} />
        }
        ListFooterComponent={renderFooter()}
        renderSectionHeader={({section}) => (isSearching ? renderSearchHeader(section) : renderBrowseHeader(section))}
        renderItem={renderItem}
        onEndReached={loadMoreCatalogResults}
        onEndReachedThreshold={0.2}
      />
    </>
  )
}

export default AddExerciseScreen

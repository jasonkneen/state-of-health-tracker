import React from 'react'

import {SectionList, SectionListRenderItem, View} from 'react-native'

import {Exercise, isExerciseObject} from '@data/models/Exercise'
import {ExerciseTemplate} from '@data/models/ExerciseTemplate'
import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {mutationKeys} from '@queries/keys'
import {useTemplatesQuery} from '@queries/templates/useTemplatesQuery'
import {useNavigation} from '@react-navigation/native'
import {useIsMutating} from '@tanstack/react-query'

import LoadingOverlay from '@components/LoadingOverlay'
import SecondaryButton from '@components/SecondaryButton'
import Text from '@components/Text'

import Screens from '@constants/screens'
import {
  CREATE_EXERCISE_BUTTON_TEXT,
  CREATE_TEMPLATE_BUTTON_TEXT,
  NO_EXERCISES_ADDED_TEXT,
  NO_TEMPLATES_ADDED_TEXT,
  TEMPLATES_HEADER,
  YOUR_EXERCISES_HEADER
} from '@constants/strings'

import ExerciseListItem from './components/ExerciseListItem'
import ExerciseSearchBarButton from './components/SearchBarButton'
import TemplateListItem from './components/TemplateListItem'
import styles from './index.styled'
import {Navigation} from '../../navigation/types'

type SectionItem = Exercise | ExerciseTemplate

interface Section {
  title: string
  data: SectionItem[]
}

const AddExerciseScreen = () => {
  const {push} = useNavigation<Navigation>()

  const {data: templates = []} = useTemplatesQuery()
  const {data: exercises = []} = useExercisesQuery()

  // Deletes are triggered from the global bottom sheet, so this screen reflects
  // their in-flight state through the mutation cache rather than local state
  const isDeletingExercise = useIsMutating({mutationKey: mutationKeys.deleteExercise}) > 0
  const isDeletingTemplate = useIsMutating({mutationKey: mutationKeys.deleteTemplate}) > 0
  const isUpdating = isDeletingExercise || isDeletingTemplate

  const sections: Section[] = [
    {
      title: TEMPLATES_HEADER,
      data: templates
    },
    {
      title: YOUR_EXERCISES_HEADER,
      data: exercises
    }
  ]

  const renderHeader = (section: Section) => {
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

  const renderItem: SectionListRenderItem<SectionItem> = ({item}) => {
    return isExerciseObject(item) ? <ExerciseListItem exercise={item} /> : <TemplateListItem template={item} />
  }

  return (
    <>
      {isUpdating && <LoadingOverlay />}

      <SectionList<SectionItem, Section>
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        sections={sections}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={ExerciseSearchBarButton}
        ListFooterComponent={<View style={styles.listFooter} />}
        renderSectionHeader={({section}) => renderHeader(section)}
        renderItem={renderItem}
      />
    </>
  )
}

export default AddExerciseScreen

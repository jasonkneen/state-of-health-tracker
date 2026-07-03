import React, {useState} from 'react'

import {FlatList, ListRenderItemInfo, View} from 'react-native'

import {Exercise} from '@data/models/Exercise'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {useCreateTemplateMutation} from '@queries/templates/useCreateTemplateMutation'
import {useNavigation} from '@react-navigation/native'
import {Text, useStyleTheme} from '@theme/Theme'

import ExerciseTypeChip from '@components/ExerciseTypeChip'
import ListItem from '@components/ListItem'
import LoadingOverlay from '@components/LoadingOverlay'
import PrimaryButton from '@components/PrimaryButton'
import SearchBar from '@components/SearchBar'
import {showToast} from '@components/toast/util/ShowToast'

import Spacing from '@constants/Spacing'
import {
  CREATE_TEMPLATE_NO_EXERCISES,
  NEXT_BUTTON_TEXT,
  SEARCH_EXERCISES_PLACEHOLDER,
  SELECT_EXERCISES_FOR_TEMPLATE_TITLE,
  TOAST_TEMPLATE_CREATED,
  TOAST_TEMPLATE_CREATION_ERROR
} from '@constants/Strings'

import CreateTemplateModal from './components/CreateTemplateModal'
import styles from './index.styled'
import {filterExercises} from '../../utility/filterExercises'

const CreateTemplateScreen = () => {
  const theme = useStyleTheme()
  const {goBack} = useNavigation()

  const {data: allExercises = []} = useExercisesQuery()
  const {mutateAsync: createTemplate, isPending: isCreatingTemplate} = useCreateTemplateMutation()

  const [searchFilter, setSearchFilter] = useState('')
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  const exercises = filterExercises(allExercises, searchFilter)

  const renderItem = ({item}: ListRenderItemInfo<Exercise>) => (
    <ListItem
      isSwipeable={false}
      leftRightMargin={Spacing.MEDIUM}
      title={item.name}
      backgroundColor={selectedExercises.includes(item) ? theme.colors.tertiary : theme.colors.background}
      subtitle={item.exerciseBodyPart}
      chip={<ExerciseTypeChip exerciseType={item.exerciseType} />}
      onPress={() => {
        if (selectedExercises.includes(item)) {
          setSelectedExercises(prev => prev.filter(e => e.id !== item.id))
        } else {
          setSelectedExercises(prev => [...prev, item])
        }
      }}
    />
  )

  const onNextPressed = () => {
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

      <SearchBar placeholder={SEARCH_EXERCISES_PLACEHOLDER} onSearchTextChanged={setSearchFilter} />

      {exercises.length === 0 ? (
        <>
          <MaterialCommunityIcons
            style={styles.emptyIcon}
            name="kettlebell"
            size={100}
            color={useStyleTheme().colors.white}
          />

          <Text style={styles.emptyText}>{CREATE_TEMPLATE_NO_EXERCISES}</Text>
        </>
      ) : (
        <FlatList
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          initialNumToRender={10}
          data={[...selectedExercises, ...exercises.filter(e => !selectedExercises.includes(e))]}
          ListHeaderComponent={<Text style={styles.headerText}>{SELECT_EXERCISES_FOR_TEMPLATE_TITLE}</Text>}
          ListFooterComponent={
            <PrimaryButton style={styles.footerButton} label={NEXT_BUTTON_TEXT} onPress={onNextPressed} />
          }
          renderItem={renderItem}
        />
      )}
    </View>
  )
}

export default CreateTemplateScreen

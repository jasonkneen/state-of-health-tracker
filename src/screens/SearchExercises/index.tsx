import React, {useCallback, useEffect, useState} from 'react'

import {FlatList, ListRenderItemInfo, View} from 'react-native'

import {mapExerciseType} from '@data/converters/ExerciseConverter'
import {CreateExercisePayload, Exercise} from '@data/models/Exercise'
import {useCreateExerciseMutation} from '@queries/exercises/useCreateExerciseMutation'
import {useExercisesQuery} from '@queries/exercises/useExercisesQuery'
import {useNavigation} from '@react-navigation/native'
import exerciseSearchService from '@service/exercises/ExerciseSearchService'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'
import {debounce} from 'lodash'

import ExerciseTypeChip from '@components/ExerciseTypeChip'
import ListItem from '@components/ListItem'
import LoadingOverlay from '@components/LoadingOverlay'
import SearchBar from '@components/SearchBar'
import {showToast} from '@components/toast/util/ShowToast'

import {SEARCH_ADD_EXERCISE_ERROR, SEARCH_ADD_EXERCISE_SUCCESS, SEARCH_EXERCISES_PLACEHOLDER} from '@constants/strings'

import styles from './index.styled'
import {Navigation} from '../../navigation/types'

const LoadBatchSize = 50

const SearchExercisesScreen = () => {
  const {popToTop} = useNavigation<Navigation>()
  const [searchText, setSearchText] = useState('')
  const [results, setResults] = useState<CreateExercisePayload[]>([])
  const [batchCount, setBatchCount] = useState(1)

  const {data: exercises = []} = useExercisesQuery()
  const {mutateAsync: createExercise, isPending: isCreatingExercise} = useCreateExerciseMutation()
  const {addDailyExercise} = useDailyWorkoutEntryStore()

  const debouncedSearch = useCallback(
    debounce((filter: string) => {
      const searchResults = exerciseSearchService.searchExercises(filter, LoadBatchSize * 2)

      setResults(searchResults.slice(0, LoadBatchSize))
      setBatchCount(1)
    }, 300),
    []
  )

  useEffect(() => {
    debouncedSearch(searchText)

    return debouncedSearch.cancel
  }, [searchText, debouncedSearch])

  const handleLoadMore = () => {
    const nextBatch = batchCount + 1
    const end = nextBatch * LoadBatchSize
    const moreResults = exerciseSearchService.searchExercises(searchText, end)

    setResults(moreResults)
    setBatchCount(nextBatch)
  }

  const addToWorkout = (exercise: Exercise) => {
    showToast('success', SEARCH_ADD_EXERCISE_SUCCESS, exercise.name)
    addDailyExercise(exercise)
    popToTop()
  }

  const onExercisePressed = async (payload: CreateExercisePayload) => {
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
    } catch (error) {
      showToast('error', SEARCH_ADD_EXERCISE_ERROR)
    }
  }

  const renderItem = ({item}: ListRenderItemInfo<CreateExercisePayload>) => (
    <ListItem
      isSwipeable={false}
      leftRightMargin={Spacing.SMALL}
      title={item.name}
      backgroundColor={Theme.colors.background}
      subtitle={item.exerciseBodyPart}
      chip={<ExerciseTypeChip exerciseType={mapExerciseType(item.exerciseType)} />}
      onPress={() => onExercisePressed(item)}
    />
  )

  return (
    <View style={styles.container}>
      {isCreatingExercise && <LoadingOverlay />}

      <SearchBar placeholder={SEARCH_EXERCISES_PLACEHOLDER} onSearchTextChanged={setSearchText} />

      <FlatList
        style={styles.listContainer}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        initialNumToRender={10}
        data={results}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
      />
    </View>
  )
}

export default SearchExercisesScreen

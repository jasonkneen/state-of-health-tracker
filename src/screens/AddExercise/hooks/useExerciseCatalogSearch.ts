import {useEffect, useMemo, useState} from 'react'

import {CreateExercisePayload} from '@data/models/Exercise'
import exerciseSearchService from '@service/exercises/ExerciseSearchService'
import {debounce} from 'lodash'

const LoadBatchSize = 50

export const useExerciseCatalogSearch = () => {
  const [searchText, setSearchText] = useState('')
  const [catalogResults, setCatalogResults] = useState<CreateExercisePayload[]>([])
  const [batchCount, setBatchCount] = useState(1)

  const searchTerm = searchText.trim()
  const isSearching = searchTerm !== ''

  const debouncedCatalogSearch = useMemo(
    () =>
      debounce((filter: string) => {
        setCatalogResults(exerciseSearchService.searchExercises(filter, LoadBatchSize))
        setBatchCount(1)
      }, 300),
    []
  )

  useEffect(() => {
    debouncedCatalogSearch(searchTerm)

    return debouncedCatalogSearch.cancel
  }, [searchTerm, debouncedCatalogSearch])

  const loadMoreCatalogResults = () => {
    if (!isSearching) return

    const nextBatch = batchCount + 1

    setCatalogResults(exerciseSearchService.searchExercises(searchTerm, nextBatch * LoadBatchSize))
    setBatchCount(nextBatch)
  }

  return {
    searchTerm,
    isSearching,
    catalogResults,
    setSearchText,
    loadMoreCatalogResults
  }
}

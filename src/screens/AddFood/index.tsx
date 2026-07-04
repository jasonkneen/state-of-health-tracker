import React, {useEffect, useState} from 'react'

import {SectionList, SectionListRenderItem, View} from 'react-native'

import {BrandedFood} from '@data/models/BrandedFood'
import {Food, formatServingText} from '@data/models/Food'
import {AddFoodRouteProp, Navigation} from '@navigation/types'
import {useBrandedFoodSearchQuery} from '@queries/foods/useBrandedFoodSearchQuery'
import {useDeleteFoodMutation} from '@queries/foods/useDeleteFoodMutation'
import {useFoodsInfiniteQuery} from '@queries/foods/useFoodsQuery'
import {useNavigation, useRoute} from '@react-navigation/native'
import Spacing from '@styles/spacing'
import ListSwipeItemManager from '@utility/ListSwipeItemManager'

import SearchBar from '@components/SearchBar'
import SecondaryButton from '@components/SecondaryButton'
import SwipeDeleteListItem from '@components/SwipeDeleteListItem'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import Screens from '@constants/screens'
import {
  ADD_FOOD_TITLE,
  ADDING_TO_EYEBROW,
  NEW_FOOD_BUTTON_TEXT,
  NO_FOOD_FOUND_EMPTY_TEXT,
  SEARCH_YOUR_FOODS_PLACEHOLDER,
  TOAST_GENERIC_ERROR,
  YOUR_FOODS_HEADER
} from '@constants/strings'

import AiEscapeHatchCard from './components/AiEscapeHatchCard'
import FoodListRow from './components/FoodListRow'
import styles from './index.styled'
import {formatMacroSummary, mapBrandedFoodToFood} from './index.util'

// Missing from @constants/strings — there is no header constant for the
// branded search results section.
const BRANDED_HEADER = 'Branded'

const SEARCH_DEBOUNCE_MS = 400

const BRANDED_MIN_QUERY_LENGTH = 2

type SectionItem = Food | BrandedFood

interface Section {
  key: 'library' | 'branded'
  title: string
  data: SectionItem[]
}

const listSwipeItemManager = new ListSwipeItemManager()

const AddFoodScreen = () => {
  const navigation = useNavigation<Navigation>()
  const {
    params: {mealId, mealName}
  } = useRoute<AddFoodRouteProp>()

  const [searchText, setSearchText] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(searchText), SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [searchText])

  const foodsQuery = useFoodsInfiniteQuery(debouncedQuery)
  const brandedQuery = useBrandedFoodSearchQuery(debouncedQuery)
  const deleteFoodMutation = useDeleteFoodMutation()

  const foods = foodsQuery.data?.pages.flatMap(page => page.foods) ?? []
  const isBrandedSearchActive = debouncedQuery.trim().length > BRANDED_MIN_QUERY_LENGTH
  const brandedFoods = isBrandedSearchActive ? (brandedQuery.data ?? []) : []

  // Excludes pagination so scrolling the library doesn't flash the search spinner
  const isSearching = (foodsQuery.isFetching && !foodsQuery.isFetchingNextPage) || brandedQuery.isFetching

  listSwipeItemManager.setRows(foods)

  const sections: Section[] = []

  // The branded section stays quiet unless it has something to show — errors
  // and empty results just leave the library list as the only content
  const showBranded = isBrandedSearchActive && (brandedFoods.length > 0 || brandedQuery.isFetching)

  // An empty library yields to branded results; without them it stays visible
  // so the empty state and New Food button still render
  const showLibrary = foods.length > 0 || foodsQuery.isLoading || !showBranded

  if (showLibrary) {
    sections.push({key: 'library', title: YOUR_FOODS_HEADER, data: foods})
  }

  if (showBranded) {
    sections.push({key: 'branded', title: BRANDED_HEADER, data: brandedFoods})
  }

  const openFoodDetail = (food: Food) => {
    navigation.push(Screens.FOOD_DETAIL_SCREEN, {path: 'add', mealId, mealName, food})
  }

  const onDeleteFoodPressed = async (food: Food) => {
    try {
      await deleteFoodMutation.mutateAsync(food.id)
    } catch {
      showToast('error', TOAST_GENERIC_ERROR)
    }
  }

  const renderItem: SectionListRenderItem<SectionItem, Section> = ({item, index, section}) => {
    if (section.key === 'branded') {
      const brandedFood = item as BrandedFood

      return (
        <FoodListRow
          name={brandedFood.name}
          subtitle={brandedFood.brand}
          calories={brandedFood.calories}
          onPress={() => openFoodDetail(mapBrandedFoodToFood(brandedFood))}
        />
      )
    }

    const food = item as Food

    return (
      <SwipeDeleteListItem
        deleteIconRightMargin={Spacing.MEDIUM}
        swipeableRef={ref => listSwipeItemManager.setRef(ref, food, index)}
        onSwipeActivated={() => listSwipeItemManager.closeRow(food, index)}
        onDeletePressed={() => onDeleteFoodPressed(food)}>
        <FoodListRow
          name={food.name}
          detail={formatServingText(food)}
          subtitle={formatMacroSummary(food.protein, food.carbs, food.fat)}
          calories={food.calories}
          onPress={() => openFoodDetail(food)}
        />
      </SwipeDeleteListItem>
    )
  }

  const renderSectionHeader = (section: Section) => {
    if (section.key === 'branded') {
      return (
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderText}>{section.title}</Text>

          {!showLibrary && (
            <SecondaryButton
              label={NEW_FOOD_BUTTON_TEXT}
              onPress={() => navigation.push(Screens.CREATE_FOOD, {prefillName: searchText})}
            />
          )}
        </View>
      )
    }

    return (
      <>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderText}>{section.title}</Text>

          <SecondaryButton
            label={NEW_FOOD_BUTTON_TEXT}
            onPress={() => navigation.push(Screens.CREATE_FOOD, {prefillName: searchText})}
          />
        </View>

        {!foodsQuery.isLoading && foods.length === 0 && (
          <Text style={styles.emptyText}>{NO_FOOD_FOUND_EMPTY_TEXT}</Text>
        )}
      </>
    )
  }

  return (
    <SectionList<SectionItem, Section>
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.listContent}
      sections={sections}
      keyExtractor={item => item.id}
      ListHeaderComponent={
        <>
          <Text style={styles.eyebrow}>{`${ADDING_TO_EYEBROW} ${mealName.toUpperCase()}`}</Text>

          <Text style={styles.title}>{ADD_FOOD_TITLE}</Text>

          <SearchBar
            placeholder={SEARCH_YOUR_FOODS_PLACEHOLDER}
            isLoading={isSearching}
            onSearchTextChanged={setSearchText}
          />

          <AiEscapeHatchCard onPress={() => navigation.push(Screens.LOG_WITH_AI, {mealId, initialText: searchText})} />
        </>
      }
      renderSectionHeader={({section}) => renderSectionHeader(section)}
      renderItem={renderItem}
      onEndReached={() => {
        if (foodsQuery.hasNextPage && !foodsQuery.isFetchingNextPage) {
          foodsQuery.fetchNextPage()
        }
      }}
      onEndReachedThreshold={0.2}
    />
  )
}

export default AddFoodScreen

import React, {useState} from 'react'

import {FlatList, ListRenderItemInfo} from 'react-native'

import {MaterialCommunityIcons} from '@expo/vector-icons'
import {formatMacros} from '@store/food/models/FoodItem'
import LocalStore from '@store/LocalStore'
import {Screen, useStyleTheme} from '@theme/Theme'
import {useSelector} from 'react-redux'

import CalorieChip from '@components/CalorieChip'
import Chip from '@components/Chip'
import PreviousEntryListItem, {EmptyState} from '@components/PreviousEntryListItem'

import Spacing from '@constants/Spacing'
import {
  CAL_LABEL,
  CALORIES_LABEL,
  MEALS_LABEL,
  PREVIOUS_MEAL_ENTRIES_EMPTY_BODY,
  PREVIOUS_MEAL_ENTRIES_EMPTY_TITLE
} from '@constants/Strings'

import {DailyMealEntry, getPreviousDailyMealEntriesSelector} from '../selectors/MealsSelector'

const PreviousDailyMealEntriesScreen = () => {
  const loadBatchIncrement = 20
  const [loadBatch, setLoadBatch] = useState(5)

  const entries = useSelector<LocalStore, DailyMealEntry[]>((state: LocalStore) =>
    getPreviousDailyMealEntriesSelector(state, loadBatch)
  )

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={
          <MaterialCommunityIcons
            style={{
              alignSelf: 'center',
              marginTop: Spacing.MEDIUM
            }}
            name="food-turkey"
            size={256}
            color={useStyleTheme().colors.secondary}
          />
        }
        title={PREVIOUS_MEAL_ENTRIES_EMPTY_TITLE}
        body={PREVIOUS_MEAL_ENTRIES_EMPTY_BODY}
      />
    )
  }

  const renderCalorieChipForMeal = (calories: number) => (
    <CalorieChip
      style={{
        position: 'absolute',
        marginTop: Spacing.X_SMALL,
        marginBottom: Spacing.X_SMALL,
        marginRight: Spacing.X_SMALL,
        top: 0,
        right: 0,
        bottom: 0
      }}
      calories={Math.round(calories)}
    />
  )

  const renderItem = ({item}: ListRenderItemInfo<DailyMealEntry>) => (
    <PreviousEntryListItem
      column1Label={MEALS_LABEL}
      column2Label={CALORIES_LABEL}
      subItems={item.meals}
      day={item.day}
      headerChip={
        <Chip
          label={`${Math.round(item.totalCalories)} ${CAL_LABEL}`}
          style={{
            paddingRight: Spacing.SMALL,
            paddingLeft: Spacing.SMALL,
            alignSelf: 'flex-start'
          }}
        />
      }
      getChipForItem={entry => renderCalorieChipForMeal(entry.mealCalories)}
      getTitleForItem={entry => entry.meal.name}
      getSubtitleForItem={entry => formatMacros(entry.mealMacros)}
    />
  )

  return (
    <Screen>
      <FlatList
        style={{
          paddingTop: Spacing.MEDIUM,
          height: '100%'
        }}
        showsVerticalScrollIndicator={false}
        data={entries}
        renderItem={renderItem}
        onEndReached={() => setLoadBatch(loadBatchIncrement + loadBatch)}
      />
    </Screen>
  )
}

export default PreviousDailyMealEntriesScreen

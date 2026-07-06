import {EstimateItem} from '@data/models/MacroEstimate'
import {InputMethodEnum, LogMealEntryPayload} from '@data/models/MealEntry'

import {CAL_LABEL} from '@constants/strings'

export const MAX_CALORIE_INPUT_LENGTH = 5

export const sortMealsBySortOrder = <T extends {sortOrder: number}>(meals: T[]): T[] =>
  [...meals].sort((a, b) => a.sortOrder - b.sortOrder)

export const sumItemCalories = (items: EstimateItem[]): number =>
  items.reduce((total, item) => total + item.calories, 0)

// Older estimates ended quantityText with "· 12g protein"; macros now render
// from the item's actual fields, so any trailing protein note is stripped to
// avoid showing it twice (and to avoid contradicting grounded values).
export const formatItemSubtitle = (item: EstimateItem): string => {
  const quantity = item.quantityText.replace(/\s*·\s*\d+g protein\s*$/i, '').trim()
  const macros = `${item.protein}g P · ${item.carbs}g C · ${item.fat}g F`

  return quantity ? `${quantity} · ${macros}` : macros
}

export const parseCalorieInput = (text: string): number | null => {
  const trimmed = text.trim()

  if (!/^\d+$/.test(trimmed)) return null

  const parsed = parseInt(trimmed, 10)

  if (!Number.isFinite(parsed)) return null

  return parsed
}

// Scales protein/carbs/fat proportionally to the calorie change so an edited
// item keeps the same macro ratio. Items estimated at 0 calories have no ratio
// to preserve, so their macros are left untouched.
export const scaleItemToCalories = (item: EstimateItem, newCalories: number): EstimateItem => {
  if (newCalories === item.calories) return item

  if (item.calories <= 0) return {...item, calories: newCalories}

  const ratio = newCalories / item.calories

  return {
    ...item,
    calories: newCalories,
    protein: Math.round(item.protein * ratio),
    carbs: Math.round(item.carbs * ratio),
    fat: Math.round(item.fat * ratio)
  }
}

export const buildLogEntryPayload = (item: EstimateItem, hasPhoto: boolean, rawInput: string): LogMealEntryPayload => ({
  name: item.name,
  servingText: item.quantityText,
  servings: 1,
  calories: item.calories,
  protein: item.protein,
  carbs: item.carbs,
  fat: item.fat,
  inputMethod: hasPhoto ? InputMethodEnum.AI_PHOTO : InputMethodEnum.AI_TEXT,
  rawInput: rawInput || undefined
})

export const formatAddItemsLabel = (count: number, mealName: string): string =>
  `Add ${count} ${count === 1 ? 'item' : 'items'} to ${mealName}`

export const formatTotalCaloriesLabel = (totalCalories: number): string => `~${totalCalories} ${CAL_LABEL} total`

export const formatAiUsageCaption = (used: number, limit: number): string =>
  `${Math.max(limit - used, 0)} of ${limit} AI estimates left today`

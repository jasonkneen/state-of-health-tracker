import {EstimateItem} from '@data/models/MacroEstimate'
import {InputMethodEnum} from '@data/models/MealEntry'

import {
  buildLogEntryPayload,
  formatAddItemsLabel,
  formatAiUsageCaption,
  formatTotalCaloriesLabel,
  parseCalorieInput,
  scaleItemToCalories,
  sortMealsBySortOrder,
  sumItemCalories,
  formatItemSubtitle
} from '../index.util'

const item = (overrides: Partial<EstimateItem> = {}): EstimateItem => ({
  name: 'Eggs, large',
  quantityText: '2 · 12g protein',
  calories: 156,
  protein: 12,
  carbs: 1,
  fat: 10,
  ...overrides
})

describe('sortMealsBySortOrder', () => {
  it('sorts meals ascending by sortOrder without mutating the input', () => {
    const meals = [
      {id: 'c', sortOrder: 2},
      {id: 'a', sortOrder: 0},
      {id: 'b', sortOrder: 1}
    ]

    const sorted = sortMealsBySortOrder(meals)

    expect(sorted.map(meal => meal.id)).toEqual(['a', 'b', 'c'])
    expect(meals.map(meal => meal.id)).toEqual(['c', 'a', 'b'])
  })
})

describe('sumItemCalories', () => {
  it('sums the calories of all items', () => {
    expect(sumItemCalories([item({calories: 156}), item({calories: 262}), item({calories: 140})])).toBe(558)
  })

  it('returns 0 for an empty list', () => {
    expect(sumItemCalories([])).toBe(0)
  })
})

describe('parseCalorieInput', () => {
  it('parses whole numbers', () => {
    expect(parseCalorieInput('156')).toBe(156)
    expect(parseCalorieInput(' 200 ')).toBe(200)
    expect(parseCalorieInput('0')).toBe(0)
  })

  it('rejects empty, negative, decimal and non-numeric input', () => {
    expect(parseCalorieInput('')).toBeNull()
    expect(parseCalorieInput('-5')).toBeNull()
    expect(parseCalorieInput('1.5')).toBeNull()
    expect(parseCalorieInput('abc')).toBeNull()
    expect(parseCalorieInput('12a')).toBeNull()
  })
})

describe('scaleItemToCalories', () => {
  it('scales protein, carbs and fat proportionally to the calorie change', () => {
    const scaled = scaleItemToCalories(item({calories: 100, protein: 10, carbs: 20, fat: 5}), 150)

    expect(scaled.calories).toBe(150)
    expect(scaled.protein).toBe(15)
    expect(scaled.carbs).toBe(30)
    expect(scaled.fat).toBe(8)
  })

  it('rounds scaled macros to whole numbers', () => {
    const scaled = scaleItemToCalories(item({calories: 156, protein: 12, carbs: 1, fat: 10}), 100)

    expect(scaled.protein).toBe(8)
    expect(scaled.carbs).toBe(1)
    expect(scaled.fat).toBe(6)
  })

  it('returns the same item when calories are unchanged', () => {
    const original = item()

    expect(scaleItemToCalories(original, original.calories)).toBe(original)
  })

  it('leaves macros untouched when the original calories are 0', () => {
    const scaled = scaleItemToCalories(item({calories: 0, protein: 3, carbs: 4, fat: 5}), 120)

    expect(scaled.calories).toBe(120)
    expect(scaled.protein).toBe(3)
    expect(scaled.carbs).toBe(4)
    expect(scaled.fat).toBe(5)
  })
})

describe('buildLogEntryPayload', () => {
  it('maps an estimate item to a log payload for a text estimate', () => {
    expect(buildLogEntryPayload(item(), false, '2 eggs')).toEqual({
      name: 'Eggs, large',
      servingText: '2 · 12g protein',
      servings: 1,
      calories: 156,
      protein: 12,
      carbs: 1,
      fat: 10,
      inputMethod: InputMethodEnum.AI_TEXT,
      rawInput: '2 eggs'
    })
  })

  it('uses AI_PHOTO and omits rawInput for a photo-only estimate', () => {
    const payload = buildLogEntryPayload(item(), true, '')

    expect(payload.inputMethod).toBe(InputMethodEnum.AI_PHOTO)
    expect(payload.rawInput).toBeUndefined()
  })
})

describe('formatAddItemsLabel', () => {
  it('pluralizes the item count', () => {
    expect(formatAddItemsLabel(3, 'Breakfast')).toBe('Add 3 items to Breakfast')
    expect(formatAddItemsLabel(1, 'Lunch')).toBe('Add 1 item to Lunch')
  })
})

describe('formatTotalCaloriesLabel', () => {
  it('formats the approximate calorie total', () => {
    expect(formatTotalCaloriesLabel(558)).toBe('~558 cal total')
  })
})

describe('formatItemSubtitle', () => {
  const base = {name: 'Eggs', calories: 148, protein: 13, carbs: 1, fat: 10}

  it('appends macros to the quantity', () => {
    expect(formatItemSubtitle({...base, quantityText: '2'})).toBe('2 · 13g P · 1g C · 10g F')
  })

  it('strips a legacy trailing protein note', () => {
    expect(formatItemSubtitle({...base, quantityText: '2 · 12g protein'})).toBe('2 · 13g P · 1g C · 10g F')
  })

  it('shows macros alone when quantity is empty', () => {
    expect(formatItemSubtitle({...base, quantityText: ''})).toBe('13g P · 1g C · 10g F')
  })
})

describe('formatAiUsageCaption', () => {
  it('shows how many free estimates remain today', () => {
    expect(formatAiUsageCaption(2, 5)).toBe('3 of 5 AI estimates left today')
  })

  it('clamps to 0 when the backend over-counts', () => {
    expect(formatAiUsageCaption(6, 5)).toBe('0 of 5 AI estimates left today')
  })
})

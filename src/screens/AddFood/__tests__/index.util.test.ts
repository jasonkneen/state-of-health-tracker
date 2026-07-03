import {BrandedFood} from '@data/models/BrandedFood'
import {FoodSourceEnum} from '@data/models/Food'

import {formatMacroSummary, mapBrandedFoodToFood} from '../index.util'

const makeBrandedFood = (overrides: Partial<BrandedFood> = {}): BrandedFood => ({
  id: 'branded-1',
  name: 'Greek Yogurt',
  brand: 'Chobani',
  servingText: '1 container',
  calories: 140,
  protein: 14,
  carbs: 16,
  fat: 3,
  ...overrides
})

describe('formatMacroSummary', () => {
  it('formats gram amounts with dividers', () => {
    expect(formatMacroSummary(1, 50, 3)).toBe('1g P · 50g C · 3g F')
  })

  it('rounds fractional grams', () => {
    expect(formatMacroSummary(1.4, 49.6, 3.5)).toBe('1g P · 50g C · 4g F')
  })
})

describe('mapBrandedFoodToFood', () => {
  it('maps a branded result to a single-serving branded food', () => {
    expect(mapBrandedFoodToFood(makeBrandedFood())).toEqual({
      id: 'branded-1',
      name: 'Greek Yogurt',
      servingAmount: 1,
      servingUnit: '1 container',
      calories: 140,
      protein: 14,
      carbs: 16,
      fat: 3,
      brand: 'Chobani',
      source: FoodSourceEnum.BRANDED
    })
  })

  it('keeps null brand and serving text as-is', () => {
    const food = mapBrandedFoodToFood(makeBrandedFood({brand: null, servingText: null}))

    expect(food.brand).toBeNull()
    expect(food.servingUnit).toBeNull()
  })
})

import {BrandedFood} from '@data/models/BrandedFood'
import {Food, FoodSourceEnum} from '@data/models/Food'

// '1g P · 50g C · 3g F'
export const formatMacroSummary = (protein: number, carbs: number, fat: number): string =>
  `${Math.round(protein)}g P · ${Math.round(carbs)}g C · ${Math.round(fat)}g F`

// Branded search results are catalog rows, not library foods — shape one into a
// Food so Food Detail can treat both paths identically. The branded serving
// text rides along as the serving unit of a single serving.
export const mapBrandedFoodToFood = (brandedFood: BrandedFood): Food => ({
  id: brandedFood.id,
  name: brandedFood.name,
  servingAmount: 1,
  servingUnit: brandedFood.servingText,
  calories: brandedFood.calories,
  protein: brandedFood.protein,
  carbs: brandedFood.carbs,
  fat: brandedFood.fat,
  brand: brandedFood.brand,
  source: FoodSourceEnum.BRANDED
})

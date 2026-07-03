export enum FoodSourceEnum {
  MANUAL = 'manual',
  LABEL_SCAN = 'label_scan',
  BRANDED = 'branded',
  SEED = 'seed'
}

export interface Food {
  id: string
  name: string
  servingAmount: number
  servingUnit: string | null
  // Per-serving values.
  calories: number
  protein: number
  carbs: number
  fat: number
  brand: string | null
  source: FoodSourceEnum
}

export interface CreateFoodPayload {
  name: string
  servingAmount?: number
  servingUnit?: string
  calories: number
  protein: number
  carbs: number
  fat: number
  brand?: string
  source?: FoodSourceEnum
}

export function formatServingText(food: Food): string {
  if (!food.servingUnit) {
    return food.servingAmount === 1 ? '1 serving' : `${food.servingAmount} servings`
  }

  return `${food.servingAmount} ${food.servingUnit}`
}

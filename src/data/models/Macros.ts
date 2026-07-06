export interface MacroTotals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface MacroTargets {
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
}

export function createEmptyMacroTotals(): MacroTotals {
  return {calories: 0, protein: 0, carbs: 0, fat: 0}
}

export function caloriesFromMacros(protein: number, carbs: number, fat: number): number {
  return protein * 4 + carbs * 4 + fat * 9
}

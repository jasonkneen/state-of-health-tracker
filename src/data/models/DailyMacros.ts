import {MacroTargets, MacroTotals} from './Macros'
import {Meal} from './Meal'

export interface DailyMacros {
  date: string
  meals: Meal[]
  totals: MacroTotals
  targets: MacroTargets
}

export interface DailySummary {
  date: string
  mealCount: number
  calories: number
  protein: number
  carbs: number
  fat: number
}

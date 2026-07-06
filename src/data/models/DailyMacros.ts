import {MacroTargets, MacroTotals} from './Macros'
import {Meal} from './Meal'

export interface DailyMacros {
  date: string
  meals: Meal[]
  totals: MacroTotals
  targets: MacroTargets
}

export interface DaySummaryMeal {
  id: string
  name: string
  sortOrder: number
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface DailySummary {
  date: string
  mealCount: number
  calories: number
  protein: number
  carbs: number
  fat: number
  // Absent when the server predates the per-meal history breakdown
  meals?: DaySummaryMeal[]
}

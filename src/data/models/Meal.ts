import {MacroTotals} from './Macros'
import {MealEntry} from './MealEntry'

export interface Meal {
  id: string
  name: string
  sortOrder: number
  entries: MealEntry[]
  totals: MacroTotals
}

import {LabelScanResult} from '@data/models/MacroEstimate'
import {caloriesFromMacros} from '@data/models/Macros'

import {PickerItem} from '@components/Picker'

export interface CreateFoodFields {
  name: string
  servingAmount: string
  servingUnit: string
  protein: string
  carbs: string
  fat: string
  calories: string
}

export interface CreateFoodValidation {
  showNameError: boolean
  showMacrosError: boolean
  isValid: boolean
}

export const NO_UNIT_VALUE = 'none'

export const UNIT_OPTIONS = [NO_UNIT_VALUE, 'g', 'oz', 'cup', 'tbsp', 'tsp', 'small', 'medium', 'large', 'bowl']

// Keeps free-typed numeric fields to digits and a single decimal point
export const sanitizeDecimalInput = (text: string): string => {
  const cleaned = text.replace(/[^0-9.]/g, '')
  const [whole, ...decimals] = cleaned.split('.')

  return decimals.length > 0 ? `${whole}.${decimals.join('')}` : whole
}

export const parseNumericField = (text: string): number => {
  const parsed = parseFloat(text)

  return Number.isFinite(parsed) ? parsed : 0
}

export const computeAutoCalories = (protein: string, carbs: string, fat: string): string =>
  String(Math.round(caloriesFromMacros(parseNumericField(protein), parseNumericField(carbs), parseNumericField(fat))))

// 'Protein (g)' -> 'PROTEIN' — the macro cells render their own 'g' suffix
export const macroHeaderLabel = (header: string): string => header.replace(/\s*\(g\)$/i, '').toUpperCase()

export const validateCreateFood = (name: string, protein: string, carbs: string, fat: string): CreateFoodValidation => {
  const showNameError = name.trim() === ''
  const hasMacro = [protein, carbs, fat].some(value => parseNumericField(value) > 0)

  return {showNameError, showMacrosError: !hasMacro, isValid: !showNameError && hasMacro}
}

// Null scan values leave the current field untouched; macros and calories are
// always numbers on a LabelScanResult so they always prefill
export const applyScanResultToFields = (fields: CreateFoodFields, result: LabelScanResult): CreateFoodFields => ({
  name: result.name ?? fields.name,
  servingAmount: result.servingAmount != null ? String(result.servingAmount) : fields.servingAmount,
  servingUnit: result.servingUnit ? result.servingUnit.toLowerCase() : fields.servingUnit,
  protein: String(result.protein),
  carbs: String(result.carbs),
  fat: String(result.fat),
  calories: String(Math.round(result.calories))
})

// A scanned unit outside the stock list still needs to be selectable
export const buildUnitPickerItems = (currentUnit: string): PickerItem[] => {
  const values = UNIT_OPTIONS.includes(currentUnit) ? UNIT_OPTIONS : [...UNIT_OPTIONS, currentUnit]

  return values.map(value => ({label: value, value}))
}

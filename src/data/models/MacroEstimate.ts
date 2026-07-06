import {MacroTotals} from './Macros'

export type EstimateConfidence = 'low' | 'medium' | 'high'

export interface EstimateItem {
  name: string
  quantityText: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface MacroEstimate {
  items: EstimateItem[]
  total: MacroTotals
  confidence: EstimateConfidence
  notes: string | null
}

export interface EstimateMacrosPayload {
  text?: string
  imageBase64?: string
}

export interface LabelScanResult {
  name: string | null
  servingAmount: number | null
  servingUnit: string | null
  calories: number
  protein: number
  carbs: number
  fat: number
  confidence: EstimateConfidence
}

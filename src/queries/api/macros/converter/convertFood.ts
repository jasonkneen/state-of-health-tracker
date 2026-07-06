import {Food, FoodSourceEnum} from '@data/models/Food'
import {FoodResponse} from '@queries/api/macros/decoder/MacrosDecoder'
import * as io from 'io-ts'

const KNOWN_SOURCES = Object.values(FoodSourceEnum) as string[]

export function convertFood(data: io.TypeOf<typeof FoodResponse>): Food {
  return {
    id: data.id,
    name: data.name,
    servingAmount: data.servingAmount,
    servingUnit: data.servingUnit ?? null,
    calories: data.calories,
    protein: data.protein,
    carbs: data.carbs,
    fat: data.fat,
    brand: data.brand ?? null,
    source: KNOWN_SOURCES.includes(data.source) ? (data.source as FoodSourceEnum) : FoodSourceEnum.MANUAL
  }
}

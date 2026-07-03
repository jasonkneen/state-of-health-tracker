import {CreateFoodPayload, Food} from '@data/models/Food'
import {convertFood} from '@queries/api/macros/converter/convertFood'
import {FoodResponse} from '@queries/api/macros/decoder/MacrosDecoder'
import {httpPost} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'

import Endpoints from '@constants/endpoints'

export async function createFood(payload: CreateFoodPayload): Promise<Food> {
  try {
    const response = await httpPost(Endpoints.Foods, FoodResponse, payload)

    if (response?.status !== 201 || !response.data) {
      throw new Error(`Unexpected response creating food: status=${response?.status}`)
    }

    return convertFood(response.data)
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

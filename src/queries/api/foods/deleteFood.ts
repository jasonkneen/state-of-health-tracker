import {httpDelete} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

const DeleteResponse = io.type({success: io.boolean})

export async function deleteFood(foodId: string): Promise<void> {
  try {
    const response = await httpDelete(Endpoints.Food(foodId), DeleteResponse)

    if (response?.status !== 200) {
      throw new Error(`Unexpected response deleting food: status=${response?.status}`)
    }
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

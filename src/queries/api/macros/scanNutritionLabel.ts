import {LabelScanResult} from '@data/models/MacroEstimate'
import {httpPost} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

const LabelScanResponse = io.type({
  name: io.union([io.string, io.null]),
  servingAmount: io.union([io.number, io.null]),
  servingUnit: io.union([io.string, io.null]),
  calories: io.number,
  protein: io.number,
  carbs: io.number,
  fat: io.number,
  confidence: io.union([io.literal('low'), io.literal('medium'), io.literal('high')])
})

export async function scanNutritionLabel(imageBase64: string): Promise<LabelScanResult> {
  try {
    const response = await httpPost(Endpoints.MacroLabelScan, LabelScanResponse, {imageBase64})

    if (response?.status !== 200 || !response.data) {
      throw new Error(`Unexpected response scanning label: status=${response?.status}`)
    }

    return response.data
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

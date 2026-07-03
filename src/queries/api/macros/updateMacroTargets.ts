import {MacroTargets} from '@data/models/Macros'
import {MacroTargetsResponse} from '@queries/api/macros/decoder/MacrosDecoder'
import {httpPut} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'

import Endpoints from '@constants/endpoints'

export async function updateMacroTargets(targets: Partial<MacroTargets>): Promise<MacroTargets> {
  try {
    const response = await httpPut(Endpoints.MacroTargets, MacroTargetsResponse, targets)

    if (response?.status !== 200 || !response.data) {
      throw new Error(`Unexpected response updating targets: status=${response?.status}`)
    }

    return response.data
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

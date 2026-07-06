import {httpDelete} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

const DeleteResponse = io.type({success: io.boolean})

export async function deleteMealEntry(entryId: string): Promise<void> {
  try {
    const response = await httpDelete(Endpoints.MacroEntry(entryId), DeleteResponse)

    if (response?.status !== 200) {
      throw new Error(`Unexpected response deleting entry: status=${response?.status}`)
    }
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

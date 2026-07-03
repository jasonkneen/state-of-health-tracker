import {toCreateRunPayload} from '@data/models/RunPayload'
import {RunPersonalRecord} from '@data/models/RunPersonalRecord'
import {RunRecord} from '@data/models/RunRecord'
import {convertRun} from '@queries/api/runs/converter/convertRun'
import {RunResponseWithRecords} from '@queries/api/runs/decoder/RunDecoder'
import {httpPut} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'

import Endpoints from '@constants/endpoints'

export interface UpdateRunResult {
  run: RunRecord
  newRecords: RunPersonalRecord[]
}

/** PUT /run/:id — updates an existing run. `run.id` must already be set (the remote id). */
export async function updateRun(run: RunRecord): Promise<UpdateRunResult> {
  if (!run.id) {
    throw new Error('updateRun requires a run with a remote id — use createRun for unsynced runs.')
  }

  try {
    const response = await httpPut(`${Endpoints.Run}${run.id}`, RunResponseWithRecords, toCreateRunPayload(run))

    if (response?.status !== 200 || !response.data) {
      throw new Error(`Unexpected response: status=${response?.status}`)
    }

    const data = response.data
    const mapped = convertRun(data, run.localId)

    return {
      run: {...mapped, synced: true},
      newRecords: data.newRecords ?? []
    }
  } catch (error) {
    console.log('ERROR_UPDATING_RUN', error)
    CrashUtility.recordError(error)
    throw error
  }
}

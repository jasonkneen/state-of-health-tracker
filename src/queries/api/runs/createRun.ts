import {toCreateRunPayload} from '@data/models/RunPayload'
import {RunPersonalRecord} from '@data/models/RunPersonalRecord'
import {RunRecord} from '@data/models/RunRecord'
import {convertRun} from '@queries/api/runs/converter/convertRun'
import {RunResponseWithRecords} from '@queries/api/runs/decoder/RunDecoder'
import {httpPost} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'

import Endpoints from '@constants/endpoints'

export interface CreateRunResult {
  run: RunRecord
  newRecords: RunPersonalRecord[]
}

/** POST /run — creates a new run. Returns the synced RunRecord (original localId preserved) plus any personal records the run achieved. */
export async function createRun(run: RunRecord): Promise<CreateRunResult> {
  try {
    const response = await httpPost(Endpoints.Run, RunResponseWithRecords, toCreateRunPayload(run))

    if (response?.status !== 201 || !response.data) {
      throw new Error(`Unexpected response: status=${response?.status}`)
    }

    const data = response.data
    const mapped = convertRun(data, run.localId)

    return {
      run: {...mapped, synced: true},
      newRecords: data.newRecords ?? []
    }
  } catch (error) {
    console.log('ERROR_CREATING_RUN', error)
    CrashUtility.recordError(error)
    throw error
  }
}

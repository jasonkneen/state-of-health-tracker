import {mapRun} from '@data/converters/mapRun'
import {RunResponse} from '@data/decoders/RunDecoder'
import {RunRecord} from '@data/models/RunRecord'
import {httpGet} from '@service/http/httpUtil'
import axios from 'axios'

import Endpoints from '@constants/endpoints'

import CrashUtility from '../../utility/CrashUtility'

/** GET /run/:id returns 404 (not a null body) when the run doesn't exist, so a 404 is treated as "not found" rather than an error. */
export async function fetchRun(runId: string): Promise<RunRecord | null> {
  try {
    const response = await httpGet(`${Endpoints.Run}${runId}`, RunResponse)

    if (!response?.data) return null

    return mapRun(response.data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }

    CrashUtility.recordError(error)
    throw error
  }
}

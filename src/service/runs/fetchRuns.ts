import {mapRun} from '@data/converters/mapRun'
import {RunsListResponse} from '@data/decoders/RunDecoder'
import {RunRecord} from '@data/models/RunRecord'
import {httpGet} from '@service/http/httpUtil'

import Endpoints from '@constants/endpoints'

import CrashUtility from '../../utility/CrashUtility'

/**
 * GET /runs returns `{runs, pagination}`, not a bare array. For v1 the Runs
 * history screen just wants "recent runs", so this fetches one page and
 * returns the mapped `runs` array — the pagination block is decoded (so a
 * shape mismatch still fails loudly) but not surfaced to callers yet. Revisit
 * with `useInfiniteQuery` if/when the history screen needs to page through
 * older runs.
 */
export async function fetchRuns(page: number = 1, limit: number = 50): Promise<RunRecord[]> {
  try {
    const response = await httpGet(`${Endpoints.Runs}?page=${page}&limit=${limit}`, RunsListResponse)

    const data = response?.data

    if (!data) throw new Error('Invalid runs response')

    return data.runs.map(run => mapRun(run))
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

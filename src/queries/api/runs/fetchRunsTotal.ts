import {RunsListResponse} from '@queries/api/runs/decoder/RunDecoder'
import {httpGet} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'

import Endpoints from '@constants/endpoints'

// The lifetime run count only exists in the paginated response's pagination
// block, so this asks for the smallest possible page and reads the total.
export async function fetchRunsTotal(): Promise<number> {
  try {
    const response = await httpGet(`${Endpoints.Runs}?page=1&limit=1`, RunsListResponse)

    const data = response?.data

    if (!data) throw new Error('Invalid runs response')

    return data.pagination.total
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

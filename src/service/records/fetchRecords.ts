import {RecordsResponse} from '@data/decoders/RecordsDecoder'
import {PersonalRecord} from '@data/models/PersonalRecord'
import {httpGet} from '@service/http/httpUtil'

import Endpoints from '@constants/endpoints'

import CrashUtility from '../../utility/CrashUtility'

export async function fetchRecords(): Promise<PersonalRecord[]> {
  try {
    const response = await httpGet(Endpoints.Records, RecordsResponse)

    const data = response?.data

    if (!data) throw new Error('No records found')

    return data.exerciseRecords
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

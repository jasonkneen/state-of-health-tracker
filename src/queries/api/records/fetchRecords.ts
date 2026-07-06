import {PersonalRecord} from '@data/models/PersonalRecord'
import {httpGet} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

const PersonalRecordResponse = io.type({
  id: io.string,
  exerciseId: io.string,
  exerciseName: io.union([io.string, io.undefined]),
  recordType: io.string,
  value: io.number,
  unit: io.string,
  repsAtRecord: io.union([io.number, io.null, io.undefined]),
  achievedAt: io.string
})

// runRecords also come back on this response but aren't decoded here yet —
// nothing in the app reads them until the Runs domain needs its own records view.
const RecordsResponse = io.type({
  exerciseRecords: io.array(PersonalRecordResponse)
})

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

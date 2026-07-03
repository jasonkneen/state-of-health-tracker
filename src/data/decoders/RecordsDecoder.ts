import * as io from 'io-ts'

export const PersonalRecordResponse = io.type({
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
export const RecordsResponse = io.type({
  exerciseRecords: io.array(PersonalRecordResponse)
})

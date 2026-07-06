import * as io from 'io-ts'

// Mirrors state-of-health-be's src/types/run.ts response shapes.
const optionalNumber = io.union([io.number, io.null, io.undefined])
const optionalString = io.union([io.string, io.null, io.undefined])

export const RunSplitResponse = io.type({
  id: io.string,
  splitNumber: io.number,
  distanceMeters: io.number,
  durationSeconds: io.number,
  paceSecPerKm: optionalNumber
})

export const RunPersonalRecordResponse = io.type({
  id: io.string,
  recordType: io.string,
  value: io.number,
  unit: io.string,
  runId: optionalString,
  achievedAt: io.string
})

export const RunResponse = io.type({
  id: io.string,
  userId: io.string,
  startedAt: io.string,
  endedAt: optionalString,
  updatedAt: io.number,
  durationSeconds: io.number,
  distanceMeters: io.number,
  avgPaceSecPerKm: optionalNumber,
  elevationGainM: optionalNumber,
  elevationLossM: optionalNumber,
  avgHeartRate: optionalNumber,
  maxHeartRate: optionalNumber,
  calories: optionalNumber,
  runType: io.string,
  source: io.string,
  routePolyline: optionalString,
  notes: optionalString,
  splits: io.array(RunSplitResponse)
})

// `newRecords` is only present on create/update responses.
export const RunResponseWithRecords = io.intersection([
  RunResponse,
  io.partial({newRecords: io.array(RunPersonalRecordResponse)})
])

export const RunsListResponse = io.type({
  runs: io.array(RunResponse),
  pagination: io.type({
    page: io.number,
    limit: io.number,
    total: io.number,
    totalPages: io.number
  })
})

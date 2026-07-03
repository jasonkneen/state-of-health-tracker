import * as io from 'io-ts'

export const ExerciseHistoryEntryResponse = io.type({
  setId: io.string,
  date: io.string,
  reps: io.union([io.number, io.null]),
  weight: io.union([io.number, io.null]),
  addedWeight: io.union([io.number, io.null]),
  durationSeconds: io.union([io.number, io.null]),
  distanceMeters: io.union([io.number, io.null]),
  rpe: io.union([io.number, io.null])
})

const Pagination = io.type({
  page: io.number,
  limit: io.number,
  total: io.number,
  totalPages: io.number
})

export const ExerciseHistoryResponse = io.type({
  history: io.array(ExerciseHistoryEntryResponse),
  pagination: Pagination
})

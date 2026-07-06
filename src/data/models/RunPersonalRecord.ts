// Mirrors state-of-health-be's RunPersonalRecordResponse. Only ever appears
// on create/update run responses (`newRecords`) — surfaced to the UI so a
// completed run can call out "new PR" without a separate fetch.
export interface RunPersonalRecord {
  id: string
  recordType: string
  value: number
  unit: string
  runId?: string | null
  achievedAt: string
}

import {RunRecord} from '@data/models/RunRecord'

// Mirrors state-of-health-be's src/types/run.ts request shapes exactly.
export interface CreateRunSplitPayload {
  splitNumber: number
  distanceMeters: number
  durationSeconds: number
  paceSecPerKm?: number | null
}

export interface CreateRunPayload {
  startedAt: string
  endedAt?: string | null
  updatedAt: number
  durationSeconds: number
  distanceMeters: number
  avgPaceSecPerKm?: number | null
  elevationGainM?: number | null
  elevationLossM?: number | null
  avgHeartRate?: number | null
  maxHeartRate?: number | null
  calories?: number | null
  runType?: string
  source?: string
  routePolyline?: string | null
  notes?: string | null
  splits?: CreateRunSplitPayload[]
}

/** Builds the POST/PUT request body from a local RunRecord. `id`/`localId`/`synced`/`syncAttempts` are local-only bookkeeping and never sent. */
export function toCreateRunPayload(record: RunRecord): CreateRunPayload {
  return {
    startedAt: record.startedAt,
    endedAt: record.endedAt,
    updatedAt: record.updatedAt,
    durationSeconds: record.durationSeconds,
    distanceMeters: record.distanceMeters,
    avgPaceSecPerKm: record.avgPaceSecPerKm,
    elevationGainM: record.elevationGainM,
    elevationLossM: record.elevationLossM,
    avgHeartRate: record.avgHeartRate,
    maxHeartRate: record.maxHeartRate,
    calories: record.calories,
    runType: record.runType,
    source: record.source,
    routePolyline: record.routePolyline,
    notes: record.notes,
    splits: record.splits
  }
}

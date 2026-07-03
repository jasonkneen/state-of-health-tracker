import {encodeRoutePolyline, RunRecord} from '@data/models/RunRecord'
import {RunStats} from '@service/run/runMath'
import * as Location from 'expo-location'

export interface RunDraftInput {
  runId: string
  startTime: number
  /** Defaults to Date.now() — recovery results (RunRecoveryResult) don't carry an explicit end time the way StopRunResult does. */
  endTime?: number
  filteredPoints: Location.LocationObject[]
  stats: RunStats
}

/**
 * Builds an unsynced draft RunRecord from a finished/recovered run, shared by
 * both the normal RunFlow "Finish" path and RunHistory's crash-recovery
 * flow (both end up wanting the exact same "review this run" UI on
 * RunSummary). `routePolyline` uses RunRecord's documented downsampled-JSON
 * encoding, not a real polyline codec — see RunRecord.ts.
 */
export function buildDraftRunRecord(userId: string, input: RunDraftInput): RunRecord {
  const endTime = input.endTime ?? Date.now()

  return {
    localId: input.runId,
    userId,
    startedAt: new Date(input.startTime).toISOString(),
    endedAt: new Date(endTime).toISOString(),
    updatedAt: Date.now(),
    durationSeconds: input.stats.durationMs / 1000,
    distanceMeters: input.stats.distanceMeters,
    avgPaceSecPerKm: input.stats.avgPaceSecondsPerKm,
    calories: input.stats.calories,
    runType: 'OUTDOOR',
    source: 'GPS',
    routePolyline: encodeRoutePolyline(
      input.filteredPoints.map(point => ({latitude: point.coords.latitude, longitude: point.coords.longitude}))
    ),
    synced: false
  }
}

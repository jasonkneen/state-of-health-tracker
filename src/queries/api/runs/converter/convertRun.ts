import {RunRecord} from '@data/models/RunRecord'
import {RunResponse} from '@queries/api/runs/decoder/RunDecoder'
import * as io from 'io-ts'

/**
 * Maps a server RunResponse to the local RunRecord shape. `localId` should be
 * the original local run id when re-syncing an already-known local run (so
 * `OfflineRunStorageService.save` upserts the same row); it defaults to the
 * remote id for runs that only ever existed on the server (e.g. rows from
 * `GET /runs` on a different device).
 */
export function convertRun(data: io.TypeOf<typeof RunResponse>, localId: string = data.id): RunRecord {
  return {
    id: data.id,
    localId,
    userId: data.userId,
    startedAt: data.startedAt,
    endedAt: data.endedAt,
    updatedAt: data.updatedAt,
    durationSeconds: data.durationSeconds,
    distanceMeters: data.distanceMeters,
    avgPaceSecPerKm: data.avgPaceSecPerKm,
    elevationGainM: data.elevationGainM,
    elevationLossM: data.elevationLossM,
    avgHeartRate: data.avgHeartRate,
    maxHeartRate: data.maxHeartRate,
    calories: data.calories,
    runType: data.runType,
    source: data.source,
    routePolyline: data.routePolyline,
    notes: data.notes,
    splits: data.splits.map(split => ({
      splitNumber: split.splitNumber,
      distanceMeters: split.distanceMeters,
      durationSeconds: split.durationSeconds,
      paceSecPerKm: split.paceSecPerKm
    })),
    synced: true,
    syncAttempts: 0
  }
}

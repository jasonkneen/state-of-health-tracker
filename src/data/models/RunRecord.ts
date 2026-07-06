import {Run} from '@data/models/Run'

// Richer, persisted-and-synced GPS run record. Mirrors WorkoutDay's
// offline-sync contract (optional `id` for pre-sync records, `updatedAt`,
// `synced`, `syncAttempts`) plus the backend's CreateRunPayload/RunResponse
// fields. The simpler `Run` model in `./Run.ts` stays as the lightweight
// summary shape consumed by the history list/card UI — `toRunSummary` below
// is the only bridge between the two.
export interface RunRecordSplit {
  splitNumber: number
  distanceMeters: number
  durationSeconds: number
  paceSecPerKm?: number | null
}

export interface RunRecord {
  /** Remote id once synced; absent for a run that hasn't reached the server yet. */
  id?: string
  /** The runId from RunSessionService.start() — stable local key, used before (and after) a remote id exists. */
  localId: string
  userId: string
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
  runType: string
  source: string
  /**
   * Opaque route encoding. Rather than a full Google-polyline codec, this is
   * a JSON-stringified, downsampled array of `{lat, lng}` points (every Nth
   * filtered point, capped at a few hundred — see `encodeRoutePolyline`
   * below). The backend stores/returns it as a free-text column either way,
   * so a bespoke codec buys nothing for v1; this can be swapped for a real
   * polyline algorithm later without a payload shape change on the server.
   */
  routePolyline?: string | null
  notes?: string | null
  splits?: RunRecordSplit[]
  synced?: boolean
  syncAttempts?: number
  /**
   * True while the run is awaiting the user's Save/Discard decision on
   * RunSummary. Drafts are visible in the local pending list but are never
   * pushed by syncOfflineRuns — saving clears the flag, discarding deletes
   * the record.
   */
  draft?: boolean
}

export type RoutePoint = {lat: number; lng: number}

const MAX_ROUTE_POINTS = 300

/** Downsamples a filtered point list to at most `MAX_ROUTE_POINTS` points and JSON-encodes them. See `RunRecord.routePolyline` for the format rationale. */
export function encodeRoutePolyline(points: {latitude: number; longitude: number}[]): string | null {
  if (points.length === 0) {
    return null
  }

  const step = Math.max(1, Math.ceil(points.length / MAX_ROUTE_POINTS))
  const downsampled: RoutePoint[] = []

  for (let i = 0; i < points.length; i += step) {
    downsampled.push({lat: points[i].latitude, lng: points[i].longitude})
  }

  // Always keep the finish point — stepping can otherwise cut the route short
  const last = points[points.length - 1]
  const lastKept = downsampled[downsampled.length - 1]

  if (lastKept.lat !== last.latitude || lastKept.lng !== last.longitude) {
    downsampled.push({lat: last.latitude, lng: last.longitude})
  }

  return JSON.stringify(downsampled)
}

/** Inverse of `encodeRoutePolyline` — returns `[]` for missing/unparsable input rather than throwing. */
export function decodeRoutePolyline(routePolyline: string | null | undefined): RoutePoint[] {
  if (!routePolyline) {
    return []
  }

  try {
    const parsed = JSON.parse(routePolyline)

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** Maps a rich RunRecord down to the summary shape the history list/card UI consumes. */
export function toRunSummary(record: RunRecord): Run {
  return {
    id: record.id ?? record.localId,
    date: new Date(record.startedAt).getTime(),
    distanceMiles: record.distanceMeters / 1609.34,
    durationSeconds: record.durationSeconds,
    calories: record.calories ?? 0
  }
}

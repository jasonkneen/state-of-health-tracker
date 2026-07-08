import {RUN_LOCATION_TASK} from '@service/location/runLocationTask'
import {PauseSegment, selectElapsedMs, selectPausedMs, useRunSessionStore} from '@store/runSession/useRunSessionStore'
import {Theme} from '@styles/theme'
import CrashUtility from '@utility/CrashUtility'
import * as Location from 'expo-location'
import {v4 as uuidv4} from 'uuid'

import {MOCK_RUN_LOCATIONS_ENABLED, mockRunLocationFeed} from './mockRunLocationFeed'
import {processRunPoints, RunStats} from './runMath'
import {runPointBuffer} from './runPointBuffer'

// Re-exported so Phase B doesn't need to reach into the store module just to
// read live elapsed time off a recovered/active session.
export {selectElapsedMs}

export type StopRunResult = {
  runId: string
  startTime: number
  endTime: number
  pauseSegments: PauseSegment[]
  /** Unfiltered points exactly as delivered by the OS/TaskManager. */
  rawPoints: Location.LocationObject[]
  /** Points after the GPS quality pass (runMath.filterRunPoints) with paused-segment points excluded. */
  filteredPoints: Location.LocationObject[]
  stats: RunStats
}

type RecoverBase = {
  runId: string
  startTime: number
  /** Known only for 'completed-unsaved' sessions (set when stop() completed the session). */
  endTime: number | null
  status: 'active' | 'paused' | 'completed'
  pauseSegments: PauseSegment[]
  rawPoints: Location.LocationObject[]
  filteredPoints: Location.LocationObject[]
  stats: RunStats
}

/**
 * Return shape of `recover()` — call this once on app launch and again on
 * Runs-tab focus. `kind` tells the UI which flow to show:
 *
 * - `'none'`: no in-progress or unsaved-completed run. Show the normal
 *   Runs home/history screen.
 * - `'active-tracking'`: the OS kept the background task alive (the payoff
 *   of the TaskManager approach) — rehydrate the in-run screen directly from
 *   `pauseSegments`/`filteredPoints`/`stats`; tracking is already happening,
 *   no need to call `start()` again.
 * - `'stopped-with-buffer'`: session says a run was active/paused, but the
 *   OS task is not running (app was killed hard enough to lose it, or it
 *   never started successfully). Offer "resume run" (call `start()` again
 *   with a *new* run id and treat this as a separate continuation — this
 *   service does not support resuming the same OS task) or "save partial
 *   run" using the returned points/stats, then call `discard(runId)`.
 * - `'completed-unsaved'`: `stop()` was called (status is 'completed') but
 *   `discard()` never ran — e.g. the app died on the RunSummary screen
 *   before the user saved. Points/stats are already final; just offer
 *   save/discard.
 */
export type RunRecoveryResult =
  | {kind: 'none'}
  | ({kind: 'active-tracking' | 'stopped-with-buffer' | 'completed-unsaved'} & RecoverBase)

const START_LOCATION_OPTIONS: Location.LocationTaskOptions = {
  accuracy: Location.Accuracy.BestForNavigation,
  activityType: Location.ActivityType.Fitness,
  timeInterval: 2000,
  distanceInterval: 5,
  pausesUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: true,
  foregroundService: {
    notificationTitle: 'Run in progress',
    notificationBody: 'Tracking your route',
    notificationColor: Theme.colors.accentGreen
  }
}

class RunSessionService {
  /** Foreground-only request/check — call when the user enters the Runs feature. */
  async requestForegroundPermission(): Promise<Location.PermissionStatus> {
    const current = await Location.getForegroundPermissionsAsync()

    if (current.granted) {
      return current.status
    }

    const requested = await Location.requestForegroundPermissionsAsync()

    return requested.status
  }

  async getForegroundPermissionStatus(): Promise<Location.PermissionStatus> {
    const response = await Location.getForegroundPermissionsAsync()

    return response.status
  }

  /**
   * Background permission request — call when starting the *first* run,
   * after showing the explainer UI (Phase B owns the explainer copy/sheet).
   * Does not run automatically from `start()` so a system prompt never
   * appears without the explainer having been shown first.
   */
  async requestBackgroundPermission(): Promise<Location.PermissionStatus> {
    const current = await Location.getBackgroundPermissionsAsync()

    if (current.granted) {
      return current.status
    }

    const requested = await Location.requestBackgroundPermissionsAsync()

    return requested.status
  }

  async getBackgroundPermissionStatus(): Promise<Location.PermissionStatus> {
    const response = await Location.getBackgroundPermissionsAsync()

    return response.status
  }

  /** Convenience boolean for gating UI (persistent warning banner, degraded-mode messaging). */
  async hasBackgroundPermission(): Promise<boolean> {
    const response = await Location.getBackgroundPermissionsAsync()

    return response.granted
  }

  /**
   * Starts a new run: generates a run id, initializes the session record +
   * point buffer, and starts the OS-level background location task.
   * Requires foreground permission to already be granted (throws if not,
   * after making one request attempt) — call `requestForegroundPermission()`
   * beforehand. Does NOT request background permission; check
   * `hasBackgroundPermission` beforehand via `requestBackgroundPermission()`
   * so the UI can show degraded-mode messaging without blocking the run.
   */
  async start(): Promise<{runId: string; startTime: number; hasBackgroundPermission: boolean}> {
    const foregroundStatus = await this.requestForegroundPermission()

    if (foregroundStatus !== Location.PermissionStatus.GRANTED) {
      throw new Error('Cannot start a run without foreground location permission.')
    }

    // A dangling unresolved session (e.g. an abandoned recovery) would leak
    // its point-buffer file forever — sweep it before starting fresh.
    const previous = useRunSessionStore.getState()

    if (previous.runId && previous.status !== 'idle') {
      await runPointBuffer.clear(previous.runId)
    }

    const runId = uuidv4()
    const startTime = Date.now()
    const hasBackground = await this.hasBackgroundPermission()

    await runPointBuffer.setActiveRunId(runId)
    useRunSessionStore.getState().start(runId, startTime)

    try {
      if (MOCK_RUN_LOCATIONS_ENABLED) {
        mockRunLocationFeed.start()
      } else {
        await Location.startLocationUpdatesAsync(RUN_LOCATION_TASK, START_LOCATION_OPTIONS)
      }
    } catch (error) {
      // Roll back so the app isn't stuck thinking a run is active when the
      // OS never actually started delivering updates.
      useRunSessionStore.getState().reset()
      await runPointBuffer.setActiveRunId(null)
      CrashUtility.recordError(error)
      throw error
    }

    return {runId, startTime, hasBackgroundPermission: hasBackground}
  }

  /** Records a pause segment. Does not stop the OS task (plan doc §4) — paused-time points are dropped at finalize instead. */
  pause(): void {
    useRunSessionStore.getState().pause()
  }

  /** Closes the trailing pause segment. */
  resume(): void {
    useRunSessionStore.getState().resume()
  }

  /**
   * Stops the OS task and finalizes the run: reads the durable buffer,
   * excludes paused-segment points, runs the GPS filtering pass, and
   * computes stats. Returns everything the caller needs to persist a
   * completed `Run` (this service intentionally knows nothing about that
   * persistence layer). The session record is left in `'completed'` status
   * (not reset) and the point buffer is left on disk — call `discard(runId)`
   * once the caller has durably saved (or discarded) the run, so a crash
   * between `stop()` and saving is still recoverable via `recover()`.
   *
   * Returns `null` if there is no active/paused run to stop.
   */
  async stop(): Promise<StopRunResult | null> {
    const session = useRunSessionStore.getState()

    if (!session.runId || (session.status !== 'active' && session.status !== 'paused')) {
      return null
    }

    const runId = session.runId

    mockRunLocationFeed.stop()

    try {
      if (!MOCK_RUN_LOCATIONS_ENABLED) {
        await Location.stopLocationUpdatesAsync(RUN_LOCATION_TASK)
      }
    } catch (error) {
      // Task may already be stopped (e.g. the OS killed it) — finalize from
      // whatever is in the buffer regardless rather than losing the run.
      CrashUtility.recordError(error)
    }

    useRunSessionStore.getState().complete()

    const finalSession = useRunSessionStore.getState()
    const endTime = finalSession.endTime ?? Date.now()
    const startTime = finalSession.startTime as number
    // Moving time from the session clock — the GPS-point span still contains
    // paused wall-clock time and misses the warm-up window.
    const movingDurationMs = Math.max(0, endTime - startTime - selectPausedMs(finalSession, endTime))
    const rawPoints = await runPointBuffer.readAll(runId)
    const {filteredPoints, stats} = processRunPoints(rawPoints, finalSession.pauseSegments, movingDurationMs)

    // Clear the active-run pointer so a stray late-delivered batch never
    // appends to a run that's already been finalized.
    await runPointBuffer.setActiveRunId(null)

    return {
      runId,
      startTime,
      endTime,
      pauseSegments: finalSession.pauseSegments,
      rawPoints,
      filteredPoints,
      stats
    }
  }

  /**
   * Cleans up a finished/abandoned run: deletes its on-disk point buffer and
   * resets the session record to idle. Call after the caller has durably
   * saved the run (or the user discarded it). Safe to call for any runId,
   * including ones that no longer match the current session record.
   */
  async discard(runId: string): Promise<void> {
    await runPointBuffer.clear(runId)

    if (useRunSessionStore.getState().runId === runId) {
      useRunSessionStore.getState().reset()
    }
  }

  /**
   * Crash/kill recovery (plan doc §4) — call on app launch and on Runs-tab
   * focus. See `RunRecoveryResult` for the full contract.
   */
  async recover(): Promise<RunRecoveryResult> {
    const session = useRunSessionStore.getState()

    if (!session.runId || session.status === 'idle' || session.startTime === null) {
      return {kind: 'none'}
    }

    const {runId, startTime, status, pauseSegments} = session
    const rawPoints = await runPointBuffer.readAll(runId)

    const buildBase = (effectiveEndTime: number | null): RecoverBase => {
      // Moving time depends on how the session ended: a completed session
      // knows its end, a dead session effectively ended at its last GPS fix,
      // and a still-tracking session is measured up to now. The raw point
      // span is never used — it includes paused wall-clock time.
      const movingDurationMs =
        effectiveEndTime !== null
          ? Math.max(0, effectiveEndTime - startTime - selectPausedMs(session, effectiveEndTime))
          : selectElapsedMs(session)
      const {filteredPoints, stats} = processRunPoints(rawPoints, pauseSegments, movingDurationMs)

      return {
        runId,
        startTime,
        endTime: effectiveEndTime,
        status,
        pauseSegments,
        rawPoints,
        filteredPoints,
        stats
      }
    }

    if (status === 'completed') {
      return {kind: 'completed-unsaved', ...buildBase(session.endTime ?? null)}
    }

    // Re-sync the buffer's active-run pointer in case this is a fresh JS
    // launch (headless relaunch or cold start) where the in-memory cache in
    // runPointBuffer hasn't been seeded yet from AsyncStorage.
    await runPointBuffer.setActiveRunId(session.runId)

    const isStillTracking = await Location.hasStartedLocationUpdatesAsync(RUN_LOCATION_TASK)

    if (isStillTracking) {
      return {kind: 'active-tracking', ...buildBase(null)}
    }

    const lastPointTimestamp = rawPoints.length > 0 ? rawPoints[rawPoints.length - 1].timestamp : session.startTime

    return {kind: 'stopped-with-buffer', ...buildBase(lastPointTimestamp)}
  }

  // ---- Optional live subscription (cosmetic only — never a stats source) --

  /**
   * Lightweight foreground-only subscription for smooth live map animation.
   * NOT the source of truth for distance/stats — those always come from the
   * durable buffer via `stop()`/`recover()`. Returns an unsubscribe function.
   */
  async subscribeToLiveLocation(onLocation: (location: Location.LocationObject) => void): Promise<() => void> {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 5
      },
      onLocation
    )

    return () => subscription.remove()
  }
}

export const runSessionService = new RunSessionService()

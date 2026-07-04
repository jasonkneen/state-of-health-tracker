import AsyncStorage from '@react-native-async-storage/async-storage'
import * as FileSystem from 'expo-file-system/legacy'
import * as Location from 'expo-location'

// AsyncStorage key mirroring the in-memory "active run id" pointer. This is
// intentionally a small, separate key rather than reading the persisted
// useRunSessionStore blob directly: the TaskManager callback (runLocationTask.ts)
// can fire on a headless background relaunch where importing/hydrating the
// Zustand store adds risk and latency, and this module must stay a cheap,
// dependency-light leaf that never imports React/Zustand. RunSessionService is
// the single writer of this pointer (via setActiveRunId), called whenever it
// changes the session record's runId/status.
const ACTIVE_RUN_ID_KEY = 'run-point-buffer:active-run-id'

const filePathForRun = (runId: string) => `${FileSystem.documentDirectory}run-${runId}-points.json`
const tempFilePathForRun = (runId: string) => `${FileSystem.documentDirectory}run-${runId}-points.tmp.json`

// In-memory cache of the active run id so repeated task firings (every ~2s
// while a run is active) don't all hit AsyncStorage. Seeded from AsyncStorage
// on first read after a fresh JS launch (including headless background
// relaunches), so a killed-and-relaunched app still resolves the correct id.
let cachedActiveRunId: string | null | undefined

// Per-run write queues. Appends are read-modify-write against the run's JSON
// file, so concurrent appends for the same run must be serialized. Like
// OfflineWorkoutStorageService's withLock, writes are queued rather than
// dropped — losing a GPS point silently would defeat the durable-buffer's
// purpose, and append payloads are small/cheap so queuing is safe.
const writeQueues = new Map<string, Promise<void>>()

const runExclusive = (runId: string, task: () => Promise<void>): Promise<void> => {
  const previous = writeQueues.get(runId) ?? Promise.resolve()
  const next = previous.catch(() => undefined).then(task)

  writeQueues.set(runId, next)

  return next
}

class RunPointBuffer {
  /** Persist the run id the TaskManager callback should append to; pass `null` to clear it. */
  async setActiveRunId(runId: string | null): Promise<void> {
    cachedActiveRunId = runId

    if (runId) {
      await AsyncStorage.setItem(ACTIVE_RUN_ID_KEY, runId)
    } else {
      await AsyncStorage.removeItem(ACTIVE_RUN_ID_KEY)
    }
  }

  /** Resolves the currently active run id, seeding the in-memory cache from AsyncStorage if needed. */
  async getActiveRunId(): Promise<string | null> {
    if (cachedActiveRunId !== undefined) {
      return cachedActiveRunId
    }

    const stored = await AsyncStorage.getItem(ACTIVE_RUN_ID_KEY)

    cachedActiveRunId = stored

    return stored
  }

  /**
   * Called from the TaskManager callback. Resolves the active run id and
   * appends to its buffer. No-ops (with a console warning) if there is no
   * active run id — this can happen if a stray batch fires after `stop()`
   * clears the pointer but before `Location.stopLocationUpdatesAsync`
   * finishes tearing down the OS task.
   */
  async appendToActiveRun(locations: Location.LocationObject[]): Promise<void> {
    const runId = await this.getActiveRunId()

    if (!runId) {
      console.warn('[runPointBuffer] Received location batch with no active run id; dropping.')

      return
    }

    await this.append(runId, locations)
  }

  /** Fast, idempotent append — reads the current buffer, appends, atomically writes back. */
  async append(runId: string, locations: Location.LocationObject[]): Promise<void> {
    if (locations.length === 0) {
      return
    }

    await runExclusive(runId, async () => {
      const existing = await this.readAll(runId)
      const updated = existing.concat(locations)

      await this.writeAll(runId, updated)
    })
  }

  /** Reads every raw point buffered for a run (unfiltered — filtering happens in runMath). */
  async readAll(runId: string): Promise<Location.LocationObject[]> {
    try {
      const path = filePathForRun(runId)
      const fileInfo = await FileSystem.getInfoAsync(path)

      if (!fileInfo.exists) {
        return []
      }

      const content = await FileSystem.readAsStringAsync(path)

      return content ? JSON.parse(content) : []
    } catch (error) {
      console.error('[runPointBuffer] Failed to read buffer for run', runId, error)

      return []
    }
  }

  /** Deletes the on-disk buffer for a run. Does not touch the active-run-id pointer. */
  async clear(runId: string): Promise<void> {
    await runExclusive(runId, async () => {
      const path = filePathForRun(runId)
      const fileInfo = await FileSystem.getInfoAsync(path)

      if (fileInfo.exists) {
        await FileSystem.deleteAsync(path)
      }
    })

    writeQueues.delete(runId)
  }

  private async writeAll(runId: string, locations: Location.LocationObject[]): Promise<void> {
    const json = JSON.stringify(locations)
    const tempPath = tempFilePathForRun(runId)

    await FileSystem.writeAsStringAsync(tempPath, json)
    await FileSystem.moveAsync({
      from: tempPath,
      to: filePathForRun(runId)
    })
  }
}

export const runPointBuffer = new RunPointBuffer()

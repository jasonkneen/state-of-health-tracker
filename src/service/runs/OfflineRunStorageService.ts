import {RunRecord} from '@data/models/RunRecord'
import * as FileSystem from 'expo-file-system/legacy'

// Atomic file-per-domain offline queue for runs, mirroring
// OfflineWorkoutStorageService exactly, but keyed by `localId` (the runId
// from RunSessionService.start()) instead of by calendar date — runs aren't
// scoped to "today" the way a WorkoutDay is.
const OFFLINE_FILE_PATH = `${FileSystem.documentDirectory}unsynced-runs.json`
const TEMP_FILE_PATH = `${FileSystem.documentDirectory}unsynced-runs.tmp.json`

class OfflineRunStorageService {
  private isLocked = false

  private async withLock(task: () => Promise<void>) {
    if (this.isLocked) {
      console.log('[OfflineRunStorage] Write in progress, skipping.')

      return
    }

    this.isLocked = true
    try {
      await task()
    } finally {
      this.isLocked = false
    }
  }

  async readAll(): Promise<RunRecord[]> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(OFFLINE_FILE_PATH)

      if (!fileInfo.exists) return []

      const content = await FileSystem.readAsStringAsync(OFFLINE_FILE_PATH)

      return JSON.parse(content || '[]')
    } catch (error) {
      console.error('Failed to read offline runs:', error)

      return []
    }
  }

  async save(run: RunRecord): Promise<void> {
    await this.withLock(async () => {
      const existing = await this.readAll()

      const updated = existing.filter(r => r.localId !== run.localId)

      updated.push(run)

      const json = JSON.stringify(updated)

      await FileSystem.writeAsStringAsync(TEMP_FILE_PATH, json)
      await FileSystem.moveAsync({
        from: TEMP_FILE_PATH,
        to: OFFLINE_FILE_PATH
      })
    })
  }

  async clear(): Promise<void> {
    await this.withLock(async () => {
      const fileInfo = await FileSystem.getInfoAsync(OFFLINE_FILE_PATH)

      if (fileInfo.exists) {
        await FileSystem.deleteAsync(OFFLINE_FILE_PATH)
      }
    })
  }

  async deleteAllSynced(): Promise<void> {
    await this.withLock(async () => {
      const allRuns = await this.readAll()
      const unsyncedOnly = allRuns.filter(r => !r.synced)

      const json = JSON.stringify(unsyncedOnly)

      await FileSystem.writeAsStringAsync(TEMP_FILE_PATH, json)
      await FileSystem.moveAsync({
        from: TEMP_FILE_PATH,
        to: OFFLINE_FILE_PATH
      })

      console.log(`Deleted ${allRuns.length - unsyncedOnly.length} synced run(s).`)
    })
  }

  async deleteByLocalId(localId: string): Promise<void> {
    await this.withLock(async () => {
      const allRuns = await this.readAll()
      const remaining = allRuns.filter(r => r.localId !== localId)

      const json = JSON.stringify(remaining)

      await FileSystem.writeAsStringAsync(TEMP_FILE_PATH, json)
      await FileSystem.moveAsync({
        from: TEMP_FILE_PATH,
        to: OFFLINE_FILE_PATH
      })

      console.log(`Deleted run with localId ${localId}`)
    })
  }

  async findLocalRunByLocalId(localId: string): Promise<RunRecord | null> {
    const runs = await this.readAll()
    const run = runs.find(r => r.localId === localId)

    return run || null
  }
}

const offlineRunStorageService = new OfflineRunStorageService()

export default offlineRunStorageService

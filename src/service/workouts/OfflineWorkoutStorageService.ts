import {WorkoutDay} from '@data/models/WorkoutDay'
import {compareIsoDateStrings} from '@utility/DateUtility'
import * as FileSystem from 'expo-file-system/legacy'

const OFFLINE_FILE_PATH = `${FileSystem.documentDirectory}unsynced-workouts.json`
const TEMP_FILE_PATH = `${FileSystem.documentDirectory}unsynced-workouts.tmp.json`

class OfflineWorkoutStorageService {
  // Serializes writes instead of dropping them — a skipped write here means a
  // silently lost workout mutation when two callers race.
  private writeQueue: Promise<unknown> = Promise.resolve()

  private withLock(task: () => Promise<void>): Promise<void> {
    const result = this.writeQueue.then(task)

    this.writeQueue = result.catch(() => undefined)

    return result
  }

  async readAll(): Promise<WorkoutDay[]> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(OFFLINE_FILE_PATH)

      if (!fileInfo.exists) return []

      const content = await FileSystem.readAsStringAsync(OFFLINE_FILE_PATH)

      return JSON.parse(content || '[]')
    } catch (error) {
      console.error('Failed to read offline workouts:', error)

      return []
    }
  }

  async save(workoutDay: WorkoutDay): Promise<void> {
    await this.withLock(async () => {
      const existing = await this.readAll()

      const updated = existing.filter(w => !compareIsoDateStrings(w.date, workoutDay.date))

      updated.push(workoutDay)

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

  async deleteAllSynced(keepOnOrAfterDate?: string): Promise<void> {
    await this.withLock(async () => {
      const allWorkouts = await this.readAll()
      const remaining = allWorkouts.filter(
        w => !w.synced || (!!keepOnOrAfterDate && w.date.split('T')[0] >= keepOnOrAfterDate)
      )

      const json = JSON.stringify(remaining)

      await FileSystem.writeAsStringAsync(TEMP_FILE_PATH, json)
      await FileSystem.moveAsync({
        from: TEMP_FILE_PATH,
        to: OFFLINE_FILE_PATH
      })

      console.log(`Deleted ${allWorkouts.length - remaining.length} synced workout(s).`)
    })
  }

  async deleteByDate(date: string): Promise<void> {
    await this.withLock(async () => {
      const allWorkouts = await this.readAll()
      const remaining = allWorkouts.filter(w => !compareIsoDateStrings(w.date, date))

      const json = JSON.stringify(remaining)

      await FileSystem.writeAsStringAsync(TEMP_FILE_PATH, json)
      await FileSystem.moveAsync({
        from: TEMP_FILE_PATH,
        to: OFFLINE_FILE_PATH
      })

      console.log(`Deleted workout with date ${date}`)
    })
  }

  async findLocalWorkoutByDate(date: string): Promise<WorkoutDay | null> {
    const workouts = await this.readAll()
    const workout = workouts.find(w => compareIsoDateStrings(w.date, date))

    return workout || null
  }
}

const offlineWorkoutStorageService = new OfflineWorkoutStorageService()

export default offlineWorkoutStorageService

import {createDailyExercise, DailyExercise} from '@data/models/DailyExercise'
import {Exercise} from '@data/models/Exercise'
import {createSet, ExerciseSet} from '@data/models/ExerciseSet'
import {createWorkoutDay, WorkoutDay} from '@data/models/WorkoutDay'
import {findWorkoutDay} from '@service/workouts/findWorkoutDay'
import offlineWorkoutStorageService from '@service/workouts/OfflineWorkoutStorageService'
import syncOfflineWorkouts from '@service/workouts/syncOfflineWorkouts'
import {syncWorkoutDay} from '@service/workouts/syncWorkoutDay'
import {useSessionStore} from '@store/session/useSessionStore'
import CrashUtility from '@utility/CrashUtility'
import {compareIsoDateStrings, endOfDayIsoUTC} from '@utility/DateUtility'
import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'

export type DailyWorkoutState = {
  currentWorkoutDay: WorkoutDay | null
  isInitializing: boolean
  initCurrentWorkoutDay: (userId: string | null) => Promise<void>
  loadWorkoutDay: (dateIso: string, userId: string | null) => Promise<void>
  addDailyExercise: (exercise: Exercise) => boolean
  deleteDailyExercise: (dailyExerciseId: string) => void
  updateDailyExercises: (dailyExercises: DailyExercise[]) => void
  addSet: (exercise: Exercise) => void
  completeSet: (
    exercise: Exercise,
    setId: string,
    isCompleted: boolean,
    fields: Pick<ExerciseSet, 'weight' | 'reps' | 'addedWeight' | 'durationSeconds' | 'distanceMeters'>
  ) => void
  deleteSet: (exercise: Exercise, setId: string) => void
  markWorkoutCompleted: () => void
  setWorkoutDayId: (id: string) => void
  reset: () => void
}

const useDailyWorkoutEntryStore = create<DailyWorkoutState>()(
  immer((set, get) => {
    const persist = () => {
      const state = get()

      if (state.currentWorkoutDay) {
        offlineWorkoutStorageService
          .save({
            ...state.currentWorkoutDay,
            updatedAt: Date.now(),
            synced: false
          })
          .catch(error => CrashUtility.recordError(error))
      }
    }

    return {
      currentWorkoutDay: null,
      isInitializing: false,
      initCurrentWorkoutDay: async userId => {
        set({isInitializing: true})
        const today = useSessionStore.getState().sessionStartDateIso

        try {
          await syncOfflineWorkouts(today)

          const syncedWorkout = await syncWorkoutDay(today, userId ?? '')

          set({currentWorkoutDay: syncedWorkout})
        } catch (error) {
          CrashUtility.recordError(error)
          // syncWorkoutDay falls back to local storage internally; if even that
          // fails, start an empty workout so the screen is never stuck loading
          set({currentWorkoutDay: createWorkoutDay(userId ?? '', today)})
        } finally {
          set({isInitializing: false})
        }
      },

      loadWorkoutDay: async (dateIso, userId) => {
        const workoutDay = await findWorkoutDay(dateIso, userId ?? '')

        set({currentWorkoutDay: workoutDay})
      },

      addDailyExercise: exercise => {
        let wasAdded = true

        set(state => {
          const workout = state.currentWorkoutDay

          if (!workout) return

          if (workout.dailyExercises.some(e => e.exercise.name === exercise.name)) {
            wasAdded = false

            return
          }

          // The workout timer only exists for a live session — editing a past
          // day must never start it
          const isToday = compareIsoDateStrings(workout.date, useSessionStore.getState().sessionStartDateIso)

          if (isToday && workout.dailyExercises.length === 0 && !workout.startedAt) {
            workout.startedAt = Date.now()
          }

          workout.dailyExercises.push(createDailyExercise(exercise, workout.dailyExercises.length + 1))
        })

        persist()

        return wasAdded
      },

      deleteDailyExercise: dailyExerciseId => {
        set(state => {
          const workout = state.currentWorkoutDay

          if (!workout) return

          const filtered = workout.dailyExercises.filter(e => e.id !== dailyExerciseId)

          workout.dailyExercises = filtered.map((e, index) => ({
            ...e,
            order: index + 1
          }))

          // Deleting the last exercise resets the workout timer; it restarts
          // when the next first exercise is added
          if (workout.dailyExercises.length === 0) {
            workout.startedAt = undefined
          }
        })

        persist()
      },

      updateDailyExercises: dailyExercises => {
        set(state => {
          const workout = state.currentWorkoutDay

          if (!workout) return

          workout.dailyExercises = dailyExercises.map((exercise, index) => ({
            ...exercise,
            order: index + 1
          }))
        })

        persist()
      },
      addSet: exercise => {
        set(state => {
          const workout = state.currentWorkoutDay

          if (!workout) return

          const target = workout.dailyExercises.find(e => e.exercise.name === exercise.name)

          if (!target) return

          target.sets.push(createSet())
        })

        persist()
      },

      completeSet: (exercise, setId, isCompleted, fields) => {
        set(state => {
          const workout = state.currentWorkoutDay

          if (!workout) return

          const entry = workout.dailyExercises.find(e => e.exercise.name === exercise.name)
          const setItem = entry?.sets.find(s => s.id === setId)

          if (!setItem) return

          setItem.completed = isCompleted
          if (fields.weight !== undefined) setItem.weight = fields.weight
          if (fields.reps !== undefined) setItem.reps = fields.reps
          if (fields.addedWeight !== undefined) setItem.addedWeight = fields.addedWeight
          if (fields.durationSeconds !== undefined) setItem.durationSeconds = fields.durationSeconds
          if (fields.distanceMeters !== undefined) setItem.distanceMeters = fields.distanceMeters
          setItem.setNumber = isCompleted ? (entry?.sets.length || 0) + 1 : null

          // Sets backfilled onto a past day are stamped with the end of that
          // day, not now — the timestamp must never attribute the set to the
          // wrong calendar day (history, records, "latest sets" all live
          // server-side)
          const isToday = compareIsoDateStrings(workout.date, useSessionStore.getState().sessionStartDateIso)

          setItem.completedAt = isCompleted ? (isToday ? new Date().toISOString() : endOfDayIsoUTC(workout.date)) : null
        })

        persist()
      },

      deleteSet: (exercise, setId) => {
        set(state => {
          const workout = state.currentWorkoutDay

          if (!workout) return

          const entry = workout.dailyExercises.find(e => e.exercise.name === exercise.name)

          if (!entry) return

          entry.sets = entry.sets.filter(s => s.id !== setId)
        })

        persist()
      },

      // The network push lives in useCompleteWorkoutMutation; the store only
      // records the completion locally. If the push fails, completedAt is
      // already persisted and the regular sync flow picks it up later.
      markWorkoutCompleted: () => {
        const now = Date.now()

        set(state => {
          const workout = state.currentWorkoutDay

          if (!workout) return

          workout.completedAt = now
          workout.updatedAt = now
        })

        persist()
      },

      setWorkoutDayId: id => {
        set(state => {
          if (state.currentWorkoutDay) {
            state.currentWorkoutDay.id = id
          }
        })

        persist()
      },

      reset: () => {
        set({
          currentWorkoutDay: null,
          isInitializing: false
        })
      }
    }
  })
)

export default useDailyWorkoutEntryStore

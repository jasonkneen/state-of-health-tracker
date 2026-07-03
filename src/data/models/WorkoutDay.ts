import {DailyExercise} from './DailyExercise'

export interface WorkoutDay {
  id?: string // nullable id for new offline workouts
  userId: string
  date: string
  dailyExercises: DailyExercise[]
  updatedAt: number
  syncAttempts?: number
  synced?: boolean
  startedAt?: number // local-only: when the first exercise was added today
  completedAt?: number // local-only: when the user tapped Complete Daily Workout
}

export function createWorkoutDay(userId: string, date: string, dailyExercises: DailyExercise[] = []): WorkoutDay {
  return {
    userId,
    date,
    updatedAt: Date.now(),
    dailyExercises
  }
}

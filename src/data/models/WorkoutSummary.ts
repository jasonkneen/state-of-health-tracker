export interface WorkoutSummaryBestSet {
  weight?: number | null
  addedWeight?: number | null
  reps?: number | null
  durationSeconds?: number | null
}

export interface WorkoutSummaryExercise {
  setsCompleted: number
  loggingType: string
  bestSet?: WorkoutSummaryBestSet
  exercise: {
    name: string
  }
}

export interface WorkoutSummary {
  day: string
  workoutDayId: string
  totalWeight: number
  totalDurationSeconds: number
  totalBodyweightReps: number
  exercises: WorkoutSummaryExercise[]
}

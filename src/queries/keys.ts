export const queryKeys = {
  exercises: ['exercises'] as const,
  templates: ['templates'] as const,
  workoutSummaries: ['workoutSummaries'] as const,
  weeklyWorkoutSummaries: ['weeklyWorkoutSummaries'] as const
}

export const mutationKeys = {
  completeWorkout: ['completeWorkout'] as const,
  createExercise: ['createExercise'] as const,
  deleteExercise: ['deleteExercise'] as const,
  createTemplate: ['createTemplate'] as const,
  deleteTemplate: ['deleteTemplate'] as const
}

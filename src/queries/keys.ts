export const queryKeys = {
  exercises: ['exercises'] as const,
  templates: ['templates'] as const,
  workoutSummaries: ['workoutSummaries'] as const,
  weeklyWorkoutSummaries: ['weeklyWorkoutSummaries'] as const,
  records: ['records'] as const,
  exerciseHistory: (exerciseId: string) => ['exerciseHistory', exerciseId] as const,
  runs: ['runs'] as const,
  run: (runId: string) => ['run', runId] as const,
  weeklyRunSummary: ['weeklyRunSummary'] as const
}

export const mutationKeys = {
  completeWorkout: ['completeWorkout'] as const,
  createExercise: ['createExercise'] as const,
  deleteExercise: ['deleteExercise'] as const,
  createTemplate: ['createTemplate'] as const,
  deleteTemplate: ['deleteTemplate'] as const,
  completeRun: ['completeRun'] as const
}

export const queryKeys = {
  exercises: ['exercises'] as const,
  templates: ['templates'] as const,
  workoutSummaries: ['workoutSummaries'] as const,
  weeklyWorkoutSummaries: ['weeklyWorkoutSummaries'] as const,
  records: ['records'] as const,
  exerciseHistory: (exerciseId: string) => ['exerciseHistory', exerciseId] as const,
  runs: ['runs'] as const,
  runsTotal: ['runsTotal'] as const,
  run: (runId: string) => ['run', runId] as const,
  weeklyRunSummary: ['weeklyRunSummary'] as const,
  weighIns: ['weighIns'] as const,
  activitySteps: ['activitySteps'] as const,
  dailySteps: (days: number) => ['activitySteps', 'daily', days] as const,
  hourlySteps: (days: number) => ['activitySteps', 'hourly', days] as const,
  runWindowSteps: (runsKey: string) => ['activitySteps', 'runWindows', runsKey] as const,
  healthAuthStatus: ['healthAuthStatus'] as const
}

export const mutationKeys = {
  completeWorkout: ['completeWorkout'] as const,
  createExercise: ['createExercise'] as const,
  deleteExercise: ['deleteExercise'] as const,
  createTemplate: ['createTemplate'] as const,
  deleteTemplate: ['deleteTemplate'] as const,
  completeRun: ['completeRun'] as const,
  discardRun: ['discardRun'] as const,
  syncOfflineRuns: ['syncOfflineRuns'] as const,
  logWeighIn: ['logWeighIn'] as const,
  deleteWeighIn: ['deleteWeighIn'] as const,
  requestHealthPermissions: ['requestHealthPermissions'] as const
}

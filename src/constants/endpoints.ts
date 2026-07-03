const baseApiUrl = 'https://stateofhealthapi.com/api'

const Endpoints = {
  Exercises: `${baseApiUrl}/exercises`,
  Exercise: `${baseApiUrl}/exercise/`,
  Template: `${baseApiUrl}/template/`,
  Workout: `${baseApiUrl}/workout/`,
  WorkoutSummaries: `${baseApiUrl}/workouts/summary`,
  WeeklyWorkoutSummary: `${baseApiUrl}/workouts/weekly-summary/7`,
  ExerciseTemplates: `${baseApiUrl}/templates`,
  User: `${baseApiUrl}/user`,
  Records: `${baseApiUrl}/records`,
  ExerciseHistory: (exerciseId: string) => `${baseApiUrl}/exercises/${exerciseId}/history`,
  Run: `${baseApiUrl}/run/`,
  Runs: `${baseApiUrl}/runs`,
  // Function rather than a fixed string (like WeeklyWorkoutSummary) since the
  // Runs history screen may want to tune the window later; callers that just
  // want the current convenience default can call `Endpoints.WeeklyRunSummary()`.
  WeeklyRunSummary: (numOfWeeks: number = 7) => `${baseApiUrl}/runs/weekly-summary/${numOfWeeks}`
}

export default Endpoints

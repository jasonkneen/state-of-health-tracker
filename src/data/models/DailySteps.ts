export interface DailySteps {
  /** Local-day key, yyyy-MM-dd. */
  date: string
  steps: number
}

export interface HourlySteps {
  /** Bucket start, ISO string. */
  start: string
  steps: number
}

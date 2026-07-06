export type TimeOfDay = 'morning' | 'afternoon' | 'evening'

const AFTERNOON_START_HOUR = 12
const EVENING_START_HOUR = 17

// Representative local hour used when building a timestamp from a chosen period
export const TIME_OF_DAY_HOURS: Record<TimeOfDay, number> = {
  morning: 8,
  afternoon: 14,
  evening: 20
}

export const getTimeOfDayForHour = (hour: number): TimeOfDay => {
  if (hour < AFTERNOON_START_HOUR) return 'morning'

  if (hour < EVENING_START_HOUR) return 'afternoon'

  return 'evening'
}

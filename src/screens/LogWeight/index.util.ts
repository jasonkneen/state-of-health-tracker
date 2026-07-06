import {TIME_OF_DAY_HOURS, TimeOfDay} from '@utility/TimeOfDayUtility'
import {format, isSameDay, subDays} from 'date-fns'

import {LOG_WEIGHT_TODAY_LABEL, LOG_WEIGHT_YESTERDAY_LABEL} from '@constants/strings'

export const MAX_WEIGHT_LBS = 1000

export const parseWeightInput = (text: string): number | null => {
  const normalized = text.replace(',', '.').trim()

  if (!/^\d+(\.\d*)?$|^\.\d+$/.test(normalized)) return null

  const parsed = parseFloat(normalized)

  if (!Number.isFinite(parsed) || parsed <= 0 || parsed >= MAX_WEIGHT_LBS) return null

  return Math.round(parsed * 10) / 10
}

export const formatLogDateLabel = (date: Date, now: Date): string => {
  if (isSameDay(date, now)) return LOG_WEIGHT_TODAY_LABEL

  if (isSameDay(date, subDays(now, 1))) return LOG_WEIGHT_YESTERDAY_LABEL

  return format(date, 'EEE, MMM d')
}

export const canStepForward = (date: Date, now: Date): boolean => !isSameDay(date, now) && date < now

export const buildLoggedAtISO = (date: Date, timeOfDay: TimeOfDay): string => {
  const loggedAt = new Date(date)

  loggedAt.setHours(TIME_OF_DAY_HOURS[timeOfDay], 0, 0, 0)

  return loggedAt.toISOString()
}

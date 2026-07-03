import {format} from 'date-fns'

import {ACTIVITY_STEPS_DAY_LABEL, ACTIVITY_STEPS_TODAY_LABEL, stringWithParameters} from '@constants/strings'

import {parseDayKey} from '../../index.util'

const BAR_LABEL_FORMAT = 'EEEEE'
const DAY_NAME_FORMAT = 'EEEE'
const SCRUB_DATE_FORMAT = 'MMM d'

export interface StepBar {
  date: string
  label: string
  heightPct: number
  hitGoal: boolean
}

export const computeStepBars = (weekSteps: {date: string; steps: number}[], stepGoal: number): StepBar[] => {
  const maxSteps = Math.max(...weekSteps.map(day => day.steps), 1)

  return weekSteps.map(day => ({
    date: day.date,
    label: format(parseDayKey(day.date), BAR_LABEL_FORMAT),
    heightPct: day.steps / maxSteps,
    hitGoal: stepGoal > 0 && day.steps >= stepGoal
  }))
}

export const computeGoalProgress = (steps: number, stepGoal: number): number =>
  stepGoal > 0 ? Math.min(steps / stepGoal, 1) : 0

export const formatDayLabel = (date: string, isToday: boolean): string =>
  isToday
    ? ACTIVITY_STEPS_TODAY_LABEL
    : stringWithParameters(ACTIVITY_STEPS_DAY_LABEL, format(parseDayKey(date), DAY_NAME_FORMAT))

export const formatDayDate = (date: string): string => format(parseDayKey(date), SCRUB_DATE_FORMAT)

/** Snaps a touch x to the bar column under it, clamped to the row's bounds. */
export const clampBarIndex = (x: number, width: number, barCount: number): number => {
  'worklet'

  return Math.min(Math.max(Math.floor(x / (width / barCount)), 0), barCount - 1)
}

import {format} from 'date-fns'

import {
  ACTIVITY_REST_DAY_LABEL,
  ACTIVITY_ROW_BREAKDOWN_LIFTS,
  ACTIVITY_ROW_BREAKDOWN_RUNS,
  ACTIVITY_ROW_BREAKDOWN_STEPS,
  ACTIVITY_ROW_KCAL,
  ACTIVITY_ROW_META,
  ACTIVITY_ROW_STEPS_ONLY,
  ACTIVITY_RUN_DAY_LABEL,
  ACTIVITY_WORKOUT_DAY_LABEL,
  stringWithParameters
} from '@constants/strings'

const WEEK_ROW_DAY_FORMAT = 'EEE · MMM d'
const BAR_LABEL_FORMAT = 'EEEEE'

export const formatCount = (value: number): string => value.toLocaleString('en-US')

/** Parses a yyyy-MM-dd key as a local date (new Date('yyyy-MM-dd') would be UTC). */
const parseDayKey = (dayKey: string): Date => {
  const [year, month, day] = dayKey.split('-').map(Number)

  return new Date(year, month - 1, day)
}

export interface StepBar {
  date: string
  label: string
  heightPct: number
  isToday: boolean
  hitGoal: boolean
}

export const computeStepBars = (weekSteps: {date: string; steps: number}[], stepGoal: number): StepBar[] => {
  const maxSteps = Math.max(...weekSteps.map(day => day.steps), 1)

  return weekSteps.map((day, index) => ({
    date: day.date,
    label: format(parseDayKey(day.date), BAR_LABEL_FORMAT),
    heightPct: day.steps / maxSteps,
    isToday: index === weekSteps.length - 1,
    hitGoal: stepGoal > 0 && day.steps >= stepGoal
  }))
}

export const computeGoalProgress = (steps: number, stepGoal: number): number =>
  stepGoal > 0 ? Math.min(steps / stepGoal, 1) : 0

export type CalorieSegmentKey = 'lifts' | 'steps' | 'runs'

export interface CalorieSegment {
  key: CalorieSegmentKey
  kcal: number
}

export const computeCalorieSegments = (liftKcal: number, stepKcal: number, runKcal: number): CalorieSegment[] =>
  [
    {key: 'lifts' as const, kcal: liftKcal},
    {key: 'steps' as const, kcal: stepKcal},
    {key: 'runs' as const, kcal: runKcal}
  ].filter(segment => segment.kcal > 0)

interface ActivityDayLike {
  date: string
  steps: number
  liftKcal: number
  stepKcal: number
  runKcal: number
  totalKcal: number
  hadWorkout: boolean
  hadRun: boolean
}

export interface ActivityWeekRow {
  date: string
  dayLabel: string
  metaText: string
  kcalText: string
  breakdownText: string
}

/** Maps day summaries to display rows, dropping days with no activity at all. */
export const buildWeekRows = (days: ActivityDayLike[], stepsAvailable: boolean): ActivityWeekRow[] =>
  days
    .filter(day => day.steps > 0 || day.totalKcal > 0)
    .map(day => {
      const dayType = day.hadWorkout
        ? ACTIVITY_WORKOUT_DAY_LABEL
        : day.hadRun
          ? ACTIVITY_RUN_DAY_LABEL
          : ACTIVITY_REST_DAY_LABEL

      const breakdownParts: string[] = []

      if (day.liftKcal > 0) {
        breakdownParts.push(stringWithParameters(ACTIVITY_ROW_BREAKDOWN_LIFTS, formatCount(day.liftKcal)))
      }

      if (day.runKcal > 0) {
        breakdownParts.push(stringWithParameters(ACTIVITY_ROW_BREAKDOWN_RUNS, formatCount(day.runKcal)))
      }

      if (day.stepKcal > 0) {
        breakdownParts.push(stringWithParameters(ACTIVITY_ROW_BREAKDOWN_STEPS, formatCount(day.stepKcal)))
      }

      const isStepsOnly = day.liftKcal === 0 && day.runKcal === 0 && day.stepKcal > 0

      return {
        date: day.date,
        dayLabel: format(parseDayKey(day.date), WEEK_ROW_DAY_FORMAT),
        metaText:
          stepsAvailable && day.steps > 0
            ? stringWithParameters(ACTIVITY_ROW_META, formatCount(day.steps), dayType)
            : dayType,
        kcalText: stringWithParameters(ACTIVITY_ROW_KCAL, formatCount(day.totalKcal)),
        breakdownText: isStepsOnly ? ACTIVITY_ROW_STEPS_ONLY : breakdownParts.join(' · ')
      }
    })

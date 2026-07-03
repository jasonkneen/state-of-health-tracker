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

import {formatCount, parseDayKey} from '../../index.util'

const WEEK_ROW_DAY_FORMAT = 'EEE · MMM d'

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

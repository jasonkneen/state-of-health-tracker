import {DailySummary} from '@data/models/DailyMacros'
import {getPreviousDayISO} from '@utility/DateUtility'
import {format} from 'date-fns'

import {ON_GOAL_LABEL} from '@constants/strings'

export interface ChartDay {
  dateIso: string
  dayOfMonth: number
  calories: number
  hasData: boolean
  isToday: boolean
}

export interface GoalDelta {
  label: string
  isOnGoal: boolean
}

// Headroom above the tallest bar so the goal line never sits flush with the top
const CHART_HEADROOM = 1.08

// Days without data keep a sliver of bar for visual rhythm
export const MIN_BAR_HEIGHT_PCT = 6

// Bars within 90% of the goal get the mid-emphasis color
const NEAR_GOAL_THRESHOLD = 0.9

const MINUS_SIGN = '−'

/**
 * Returns the last 7 calendar day keys ('yyyy-MM-dd') ending on `todayIso`,
 * in ascending order, walking back one day at a time from the session date.
 */
export const buildLast7DayKeys = (todayIso: string): string[] => {
  const keys = [todayIso.split('T')[0]]

  for (let i = 0; i < 6; i++) {
    keys.unshift(getPreviousDayISO(keys[0]))
  }

  return keys
}

/**
 * Maps history summaries onto the last-7-days keys. Days with no logged
 * summary are marked as missing; the final key is today.
 */
export const assembleLast7Days = (dayKeys: string[], summaries: DailySummary[]): ChartDay[] => {
  const summariesByDate = new Map(summaries.map(summary => [summary.date.split('T')[0], summary]))
  const todayKey = dayKeys[dayKeys.length - 1]

  return dayKeys.map(key => {
    const summary = summariesByDate.get(key)

    return {
      dateIso: key,
      dayOfMonth: Number(key.split('-')[2]),
      calories: summary?.calories ?? 0,
      hasData: summary !== undefined,
      isToday: key === todayKey
    }
  })
}

/**
 * Average calories across the last-7-days window, counting only days that
 * have data. Returns 0 when no day in the window has data.
 */
export const averageCalories = (days: ChartDay[]): number => {
  const loggedDays = days.filter(day => day.hasData)

  if (loggedDays.length === 0) {
    return 0
  }

  return Math.round(loggedDays.reduce((sum, day) => sum + day.calories, 0) / loggedDays.length)
}

/**
 * The value the chart scales against: the larger of the tallest day and the
 * goal, padded with headroom so the goal line stays inside the chart.
 */
export const chartMaxCalories = (days: ChartDay[], goal: number): number =>
  Math.max(...days.map(day => day.calories), goal, 0) * CHART_HEADROOM

/** Bar height as a percentage of the chart area, with a minimum stub. */
export const barHeightPct = (calories: number, chartMax: number): number => {
  if (chartMax <= 0) {
    return MIN_BAR_HEIGHT_PCT
  }

  return Math.max((calories / chartMax) * 100, MIN_BAR_HEIGHT_PCT)
}

/** Vertical position of the dashed goal line as a percentage of chart height. */
export const goalLinePct = (goal: number, chartMax: number): number => {
  if (chartMax <= 0) {
    return 0
  }

  return Math.min((goal / chartMax) * 100, 100)
}

/** Whether a day earns the mid-emphasis bar color (>= 90% of goal). */
export const isNearGoal = (calories: number, goal: number): boolean =>
  goal > 0 && calories >= goal * NEAR_GOAL_THRESHOLD

/**
 * Right-side label under a day's calories: 'on goal' when the day met the
 * goal, otherwise the remaining calories as a minus-prefixed delta.
 */
export const goalDeltaLabel = (calories: number, goal: number): GoalDelta => {
  if (calories >= goal) {
    return {label: ON_GOAL_LABEL, isOnGoal: true}
  }

  return {label: `${MINUS_SIGN}${(goal - calories).toLocaleString()}`, isOnGoal: false}
}

/**
 * Formats a 'yyyy-MM-dd' day key as e.g. 'Thursday, July 2'. Builds the Date
 * from its parts so the string isn't parsed as UTC midnight, which would
 * display the previous calendar day in UTC+ timezones.
 */
export const formatDayTitle = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('T')[0].split('-').map(Number)

  return format(new Date(year, month - 1, day), 'EEEE, MMMM d')
}

/**
 * Formats a day's meal count and macro grams as e.g.
 * '3 meals · 92g P · 188g C · 61g F'.
 */
// 'meal(s)' has no lowercase constant in strings.ts yet — composed here until one exists
export const formatDaySubtitle = (day: DailySummary): string => {
  const mealsLabel = day.mealCount === 1 ? 'meal' : 'meals'

  return `${day.mealCount} ${mealsLabel} · ${day.protein}g P · ${day.carbs}g C · ${day.fat}g F`
}

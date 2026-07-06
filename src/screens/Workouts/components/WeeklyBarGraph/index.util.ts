import {WeeklyWorkoutSummary} from '@data/models/WeeklyWorkoutSummary'

const EMPTY_WEEK_BAR_HEIGHT = 4

export interface WeeklyBar {
  label: string
  completedWorkouts: number
  isCurrentWeek: boolean
  didHitTarget: boolean
  barHeight: number
}

/**
 * Maps week labels to renderable bars. Bars scale against the busiest week or
 * the target (whichever is larger) so the target line stays in frame; empty
 * weeks keep a sliver of bar for visual rhythm.
 */
export const computeWeeklyBars = (
  weekLabels: string[],
  weeklySummaries: WeeklyWorkoutSummary[],
  targetWorkoutsPerWeek: number,
  maxBarHeight: number
): WeeklyBar[] => {
  const weekWorkoutsCompletedMap: {[label: string]: number} = {}

  weeklySummaries.forEach(summary => {
    weekWorkoutsCompletedMap[summary.startOfWeek] = summary.completedWorkouts
  })

  const mostCompletedInAWeek = Math.max(...weekLabels.map(label => weekWorkoutsCompletedMap[label] ?? 0), 0)
  const maxScaleValue = Math.max(mostCompletedInAWeek, targetWorkoutsPerWeek)

  return weekLabels.map((label, index) => {
    const completedWorkouts = weekWorkoutsCompletedMap[label] ?? 0

    return {
      label,
      completedWorkouts,
      isCurrentWeek: index === weekLabels.length - 1,
      didHitTarget: completedWorkouts >= targetWorkoutsPerWeek,
      barHeight: Math.max((completedWorkouts / maxScaleValue) * maxBarHeight, EMPTY_WEEK_BAR_HEIGHT)
    }
  })
}

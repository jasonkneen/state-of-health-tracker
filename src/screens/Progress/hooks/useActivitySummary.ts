import {DailySteps} from '@data/models/DailySteps'
import {useDailyStepsQuery} from '@queries/activity/useDailyStepsQuery'
import {useHealthAuthStatusQuery} from '@queries/activity/useHealthAuthStatusQuery'
import {useHourlyStepsQuery} from '@queries/activity/useHourlyStepsQuery'
import {useRunWindowStepsQuery} from '@queries/activity/useRunWindowStepsQuery'
import {useRunsQuery} from '@queries/runs/useRunsQuery'
import {useWeighInsQuery} from '@queries/weighIns/useWeighInsQuery'
import {useWorkoutSummariesInfiniteQuery} from '@queries/workouts/useWorkoutSummariesInfiniteQuery'
import {isStepTrackingAvailable} from '@service/health/healthService'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import {compareIsoDateStrings} from '@utility/DateUtility'

import {
  ActivityDaySummary,
  buildActivityDays,
  buildLastNDayKeys,
  computeStepsVsAverage,
  latestBodyWeightLbs,
  TodayLocalWorkout,
  toLocalDayKey
} from './useActivitySummary.util'

const WEEK_DAYS = 7
const AVERAGE_WINDOW_DAYS = 14

export interface ActivitySummary {
  isStepsAvailable: boolean
  shouldRequestPermission: boolean
  hasStepData: boolean
  vsAveragePct: number | null
  weekSteps: DailySteps[]
  today: ActivityDaySummary
  /** Newest first, excluding today. */
  previousDays: ActivityDaySummary[]
}

const useActivitySummary = (): ActivitySummary => {
  const isStepsAvailable = isStepTrackingAvailable()

  const {data: shouldRequestPermission = false} = useHealthAuthStatusQuery(isStepsAvailable)
  const {data: dailySteps = []} = useDailyStepsQuery(WEEK_DAYS, isStepsAvailable)
  const {data: hourlySteps = []} = useHourlyStepsQuery(AVERAGE_WINDOW_DAYS, isStepsAvailable)
  const {data: runs = []} = useRunsQuery()
  const {data: summaryPages} = useWorkoutSummariesInfiniteQuery()
  const {data: weighIns = []} = useWeighInsQuery()
  const currentWorkoutDay = useDailyWorkoutEntryStore(state => state.currentWorkoutDay)

  const now = new Date()
  const dayKeys = buildLastNDayKeys(now, WEEK_DAYS)
  const dayKeySet = new Set(dayKeys)
  const weekRuns = runs.filter(run => dayKeySet.has(toLocalDayKey(run.startedAt)))

  const {data: runWindowSteps = {}} = useRunWindowStepsQuery(weekRuns, isStepsAvailable)

  const todayKey = dayKeys[dayKeys.length - 1]

  // Server-loaded workout days carry a full ISO timestamp in `date`, locally
  // created ones a plain yyyy-MM-dd — compare date parts only.
  const localCompletedSets =
    currentWorkoutDay && compareIsoDateStrings(currentWorkoutDay.date, todayKey)
      ? currentWorkoutDay.dailyExercises.flatMap(dailyExercise => dailyExercise.sets).filter(set => set.completed)
          .length
      : 0

  const todayLocalWorkout: TodayLocalWorkout | null =
    localCompletedSets > 0
      ? {
          completedSets: localCompletedSets,
          startedAtMs: currentWorkoutDay?.startedAt ?? null,
          completedAtMs: currentWorkoutDay?.completedAt ?? null
        }
      : null

  const days = buildActivityDays({
    dayKeys,
    dailySteps,
    summaries: summaryPages?.pages.flatMap(page => page.summaries) ?? [],
    runs: weekRuns,
    runWindowSteps,
    bodyWeightLbs: latestBodyWeightLbs(weighIns),
    todayLocalWorkout
  })

  return {
    isStepsAvailable,
    shouldRequestPermission,
    hasStepData: dailySteps.some(day => day.steps > 0),
    vsAveragePct: computeStepsVsAverage(hourlySteps, now),
    weekSteps: days.map(day => ({date: day.date, steps: day.steps})),
    today: days[days.length - 1],
    previousDays: days.slice(0, -1).reverse()
  }
}

export default useActivitySummary

import {DailySteps, HourlySteps} from '@data/models/DailySteps'
import {RunRecord} from '@data/models/RunRecord'
import {WeighIn} from '@data/models/WeighIn'
import {WorkoutSummary} from '@data/models/WorkoutSummary'
import {
  attributableSteps,
  DEFAULT_BODY_WEIGHT_LBS,
  estimateLiftCalories,
  estimateStepCalories
} from '@service/activity/calorieMath'
import {format, subDays} from 'date-fns'

const DAY_KEY_FORMAT = 'yyyy-MM-dd'
const DAY_KEY_LENGTH = 10
const MIN_DAYS_FOR_AVERAGE = 3
const MINUTES_PER_HOUR = 60

export interface TodayLocalWorkout {
  completedSets: number
  startedAtMs: number | null
  completedAtMs: number | null
}

export interface ActivityDaySummary {
  date: string
  steps: number
  liftKcal: number
  stepKcal: number
  runKcal: number
  totalKcal: number
  hadWorkout: boolean
  hadRun: boolean
}

export const toLocalDayKey = (date: Date | string | number): string => format(new Date(date), DAY_KEY_FORMAT)

/** Local-day keys for the trailing window ending at `now`, oldest → newest. */
export const buildLastNDayKeys = (now: Date, days: number): string[] =>
  Array.from({length: days}, (_, index) => toLocalDayKey(subDays(now, days - 1 - index)))

export const latestBodyWeightLbs = (weighIns: WeighIn[]): number => {
  let latest: WeighIn | null = null

  weighIns.forEach(weighIn => {
    if (!latest || new Date(weighIn.loggedAt).getTime() > new Date(latest.loggedAt).getTime()) {
      latest = weighIn
    }
  })

  return latest ? (latest as WeighIn).weight : DEFAULT_BODY_WEIGHT_LBS
}

interface BuildActivityDaysInput {
  /** Oldest → newest; the last entry is treated as today. */
  dayKeys: string[]
  dailySteps: DailySteps[]
  summaries: WorkoutSummary[]
  runs: RunRecord[]
  /** Steps taken inside each run's window, keyed by the run's localId. */
  runWindowSteps: Record<string, number>
  bodyWeightLbs: number
  /**
   * Today's workout from the local store — preferred over today's server
   * summary because it carries wall-clock timestamps and updates live.
   */
  todayLocalWorkout: TodayLocalWorkout | null
}

export const buildActivityDays = ({
  dayKeys,
  dailySteps,
  summaries,
  runs,
  runWindowSteps,
  bodyWeightLbs,
  todayLocalWorkout
}: BuildActivityDaysInput): ActivityDaySummary[] => {
  const stepsByDay = new Map(dailySteps.map(day => [day.date, day.steps]))

  const setsByDay = new Map<string, number>()

  summaries.forEach(summary => {
    const dayKey = summary.day.slice(0, DAY_KEY_LENGTH)
    const sets = summary.exercises.reduce((sum, exercise) => sum + exercise.setsCompleted, 0)

    setsByDay.set(dayKey, (setsByDay.get(dayKey) ?? 0) + sets)
  })

  const runsByDay = new Map<string, RunRecord[]>()

  runs.forEach(run => {
    const dayKey = toLocalDayKey(run.startedAt)

    runsByDay.set(dayKey, [...(runsByDay.get(dayKey) ?? []), run])
  })

  const todayKey = dayKeys[dayKeys.length - 1]

  return dayKeys.map(date => {
    const steps = stepsByDay.get(date) ?? 0
    const useLocalWorkout = date === todayKey && todayLocalWorkout !== null && todayLocalWorkout.completedSets > 0
    const completedSets = useLocalWorkout ? todayLocalWorkout.completedSets : (setsByDay.get(date) ?? 0)

    const liftKcal = estimateLiftCalories(
      bodyWeightLbs,
      completedSets,
      useLocalWorkout ? todayLocalWorkout.startedAtMs : null,
      useLocalWorkout ? todayLocalWorkout.completedAtMs : null
    )

    const dayRuns = runsByDay.get(date) ?? []
    const runKcal = Math.round(dayRuns.reduce((sum, run) => sum + (run.calories ?? 0), 0))
    const stepsDuringRuns = dayRuns.map(run => runWindowSteps[run.localId] ?? 0)
    const stepKcal = estimateStepCalories(attributableSteps(steps, stepsDuringRuns), bodyWeightLbs)

    return {
      date,
      steps,
      liftKcal,
      stepKcal,
      runKcal,
      totalKcal: liftKcal + stepKcal + runKcal,
      hadWorkout: completedSets > 0,
      hadRun: dayRuns.length > 0
    }
  })
}

/**
 * Today's steps vs the average of prior days *up to the same time of day*
 * (full-day averages would read negative every morning). The current hour is
 * weighted by how far into it `now` is. Returns null until at least 3 prior
 * days have step data.
 */
export const computeStepsVsAverage = (hourlySteps: HourlySteps[], now: Date): number | null => {
  const todayKey = toLocalDayKey(now)
  const currentHour = now.getHours()
  const currentHourFraction = now.getMinutes() / MINUTES_PER_HOUR

  let todaySteps = 0
  const priorDayTotals = new Map<string, number>()

  hourlySteps.forEach(bucket => {
    const start = new Date(bucket.start)
    const dayKey = toLocalDayKey(start)

    if (dayKey === todayKey) {
      todaySteps += bucket.steps

      return
    }

    const hour = start.getHours()

    if (hour > currentHour) {
      return
    }

    const weight = hour === currentHour ? currentHourFraction : 1

    priorDayTotals.set(dayKey, (priorDayTotals.get(dayKey) ?? 0) + bucket.steps * weight)
  })

  const activeDayTotals = [...priorDayTotals.values()].filter(total => total > 0)

  if (activeDayTotals.length < MIN_DAYS_FOR_AVERAGE) {
    return null
  }

  const average = activeDayTotals.reduce((sum, total) => sum + total, 0) / activeDayTotals.length

  if (average <= 0) {
    return null
  }

  return Math.round(((todaySteps - average) / average) * 100)
}

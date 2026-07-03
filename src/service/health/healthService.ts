import {DailySteps, HourlySteps} from '@data/models/DailySteps'
import {
  AuthorizationRequestStatus,
  getRequestStatusForAuthorization,
  isHealthDataAvailable,
  queryStatisticsCollectionForQuantity,
  queryStatisticsForQuantity,
  requestAuthorization
} from '@kingstinct/react-native-healthkit'
import CrashUtility from '@utility/CrashUtility'
import {format, startOfDay} from 'date-fns'

// Device step-data SDK wrapper (HealthKit). Android returns `false` from
// isStepTrackingAvailable() — the library ships no-op stubs off-iOS — and
// callers are expected to gate every query behind it. Health Connect support
// slots in behind this same interface later (plan doc ACTIVITY_TAB_PLAN.md §6).

const STEP_COUNT = 'HKQuantityTypeIdentifierStepCount' as const
const COUNT_UNIT = 'count' as const
const DAY_KEY_FORMAT = 'yyyy-MM-dd'

export const isStepTrackingAvailable = (): boolean => isHealthDataAvailable()

/**
 * Whether iOS still needs to show the permission sheet. Note HealthKit never
 * reveals whether a *granted* read permission exists — after the sheet has
 * been shown once this returns false forever, and a denied read just yields
 * zero data.
 */
export const shouldRequestStepPermissions = async (): Promise<boolean> => {
  try {
    const status = await getRequestStatusForAuthorization({toRead: [STEP_COUNT]})

    return status === AuthorizationRequestStatus.shouldRequest
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

export const requestStepPermissions = async (): Promise<boolean> => {
  try {
    return await requestAuthorization({toRead: [STEP_COUNT]})
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

/**
 * Step totals per local day covering [from, to], one entry per day.
 * HealthKit dedupes overlapping sources (e.g. a second device) in the
 * cumulative sum.
 */
export const getDailySteps = async (from: Date, to: Date): Promise<DailySteps[]> => {
  try {
    const anchor = startOfDay(from)

    const buckets = await queryStatisticsCollectionForQuantity(
      STEP_COUNT,
      ['cumulativeSum'],
      anchor,
      {day: 1},
      {filter: {date: {startDate: anchor, endDate: to}}, unit: COUNT_UNIT}
    )

    return buckets
      .filter(bucket => bucket.startDate != null)
      .map(bucket => ({
        date: format(bucket.startDate as Date, DAY_KEY_FORMAT),
        steps: Math.round(bucket.sumQuantity?.quantity ?? 0)
      }))
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

/** Total steps inside an arbitrary window — used to exclude run-window steps. */
export const getStepsInWindow = async (start: Date, end: Date): Promise<number> => {
  try {
    const stats = await queryStatisticsForQuantity(STEP_COUNT, ['cumulativeSum'], {
      filter: {date: {startDate: start, endDate: end}},
      unit: COUNT_UNIT
    })

    return Math.round(stats.sumQuantity?.quantity ?? 0)
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

/** Hourly step buckets covering [from, to] — feeds the same-time-of-day average. */
export const getHourlySteps = async (from: Date, to: Date): Promise<HourlySteps[]> => {
  try {
    const anchor = startOfDay(from)

    const buckets = await queryStatisticsCollectionForQuantity(
      STEP_COUNT,
      ['cumulativeSum'],
      anchor,
      {hour: 1},
      {filter: {date: {startDate: anchor, endDate: to}}, unit: COUNT_UNIT}
    )

    return buckets
      .filter(bucket => bucket.startDate != null)
      .map(bucket => ({
        start: (bucket.startDate as Date).toISOString(),
        steps: Math.round(bucket.sumQuantity?.quantity ?? 0)
      }))
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

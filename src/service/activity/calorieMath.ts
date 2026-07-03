// Pure calorie-estimation math for the Activity tab (plan doc
// ACTIVITY_TAB_PLAN.md §2). Lift and step estimates share one MET-based model
// so the breakdown segments are mutually consistent; run calories are NOT
// computed here — the Activity tab reuses RunRecord.calories so runs always
// match what the Runs screens show.

const POUNDS_PER_KILOGRAM = 2.20462

export const DEFAULT_BODY_WEIGHT_LBS = 180

// Compendium of Physical Activities reference value for "resistance
// training, multiple exercises, 8–15 reps" — deliberately the conservative
// choice so the app under- rather than over-promises burn. Standard MET
// formula: kcal/min = MET × 3.5 × kg / 200.
const LIFT_SESSION_MET = 3.5
const LIFT_KCAL_PER_MINUTE_PER_KG = (LIFT_SESSION_MET * 3.5) / 200

// ~3.5 MET walking at ~100 steps/min ≈ 0.04 kcal per step at 180 lb.
const STEP_KCAL_PER_STEP_PER_KG = 0.0005

const MIN_MINUTES_PER_SET = 2
const MAX_MINUTES_PER_SET = 6
const FALLBACK_MINUTES_PER_SET = 3.5
const MAX_SESSION_MINUTES = 180

const MS_PER_MINUTE = 60_000

export const poundsToKilograms = (pounds: number): number => pounds / POUNDS_PER_KILOGRAM

/**
 * Wall-clock session length when start/end timestamps are known, clamped to
 * per-set sanity bounds so abandoned or forgot-to-complete sessions don't
 * balloon the estimate. Falls back to a per-set estimate when timestamps are
 * missing (e.g. server history, which doesn't persist them yet).
 */
export const estimateLiftSessionMinutes = (
  completedSets: number,
  startedAtMs?: number | null,
  completedAtMs?: number | null
): number => {
  if (completedSets <= 0) {
    return 0
  }

  const minMinutes = Math.min(completedSets * MIN_MINUTES_PER_SET, MAX_SESSION_MINUTES)
  const maxMinutes = Math.min(completedSets * MAX_MINUTES_PER_SET, MAX_SESSION_MINUTES)

  if (startedAtMs == null || completedAtMs == null || completedAtMs <= startedAtMs) {
    return Math.min(completedSets * FALLBACK_MINUTES_PER_SET, MAX_SESSION_MINUTES)
  }

  const wallClockMinutes = (completedAtMs - startedAtMs) / MS_PER_MINUTE

  return Math.min(Math.max(wallClockMinutes, minMinutes), maxMinutes)
}

export const estimateLiftCalories = (
  bodyWeightLbs: number,
  completedSets: number,
  startedAtMs?: number | null,
  completedAtMs?: number | null
): number => {
  const minutes = estimateLiftSessionMinutes(completedSets, startedAtMs, completedAtMs)

  return Math.round(minutes * LIFT_KCAL_PER_MINUTE_PER_KG * poundsToKilograms(bodyWeightLbs))
}

export const estimateStepCalories = (steps: number, bodyWeightLbs: number): number =>
  Math.round(Math.max(0, steps) * STEP_KCAL_PER_STEP_PER_KG * poundsToKilograms(bodyWeightLbs))

/**
 * Steps that count toward step calories: the day's total minus steps taken
 * during run windows, which are already covered by each run's own calorie
 * value (avoids charging the same movement twice).
 */
export const attributableSteps = (totalSteps: number, runWindowSteps: number[]): number => {
  const stepsDuringRuns = runWindowSteps.reduce((sum, steps) => sum + Math.max(0, steps), 0)

  return Math.max(0, totalSteps - stepsDuringRuns)
}

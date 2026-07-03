import {ExerciseHistoryEntry} from '@data/models/PersonalRecord'

export interface SessionSummary {
  date: string
  topSet: {weight: number; reps: number} | null
  setCount: number
  estimatedOneRepMax: number | null
}

const epley1RM = (weight: number, reps: number): number => weight * (1 + reps / 30)

// Real weight, or added weight for a weighted-bodyweight set. Sets with
// neither (bodyweight/timed/distance) don't contribute to a 1RM.
const effectiveWeight = (entry: ExerciseHistoryEntry): number | null => entry.weight ?? entry.addedWeight ?? null

// Groups flat set history into one row per workout day — newest first — each
// with that session's heaviest-by-volume set and its best estimated 1RM.
export function groupHistoryIntoSessions(history: ExerciseHistoryEntry[]): SessionSummary[] {
  const byDate = new Map<string, ExerciseHistoryEntry[]>()

  history.forEach(entry => {
    const day = entry.date.slice(0, 10)

    byDate.set(day, [...(byDate.get(day) ?? []), entry])
  })

  return Array.from(byDate.entries())
    .map(([date, sets]): SessionSummary => {
      let topSet: SessionSummary['topSet'] = null
      let bestOneRepMax: number | null = null
      let bestTopSetScore = -Infinity

      sets.forEach(set => {
        const weight = effectiveWeight(set)

        if (weight === null || !set.reps) return

        const score = weight * set.reps

        if (score > bestTopSetScore) {
          bestTopSetScore = score
          topSet = {weight, reps: set.reps}
        }

        const oneRepMax = epley1RM(weight, set.reps)

        if (bestOneRepMax === null || oneRepMax > bestOneRepMax) {
          bestOneRepMax = oneRepMax
        }
      })

      return {
        date,
        topSet,
        setCount: sets.length,
        estimatedOneRepMax: bestOneRepMax !== null ? Math.round(bestOneRepMax) : null
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export interface OneRepMaxTrendPoint {
  date: string
  value: number
}

// Chronological (oldest first) points for the trend line — only sessions that
// actually produced a 1RM (skips pure-bodyweight/timed days for this exercise).
export function buildOneRepMaxTrend(sessions: SessionSummary[]): OneRepMaxTrendPoint[] {
  return sessions
    .filter((session): session is SessionSummary & {estimatedOneRepMax: number} => session.estimatedOneRepMax !== null)
    .map(session => ({date: session.date, value: session.estimatedOneRepMax}))
    .sort((a, b) => (a.date < b.date ? -1 : 1))
}

export interface OneRepMaxDelta {
  change: number
  weeks: number
}

// Delta between the newest and oldest points actually available — the label
// reflects the real window fetched, not a hardcoded "12 weeks" that may not
// match the data on hand.
export function getOneRepMaxDelta(trend: OneRepMaxTrendPoint[]): OneRepMaxDelta | null {
  if (trend.length < 2) return null

  const first = trend[0]
  const last = trend[trend.length - 1]
  const daysBetween = (new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24)

  return {
    change: last.value - first.value,
    weeks: Math.max(1, Math.round(daysBetween / 7))
  }
}

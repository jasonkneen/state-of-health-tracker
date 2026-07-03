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
// with that session's strongest set and its estimated 1RM. Sets are ranked by
// est 1RM rather than raw volume so 225 × 6 (~270) beats 135 × 20 (~225) even
// though the latter moves more total weight.
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

      sets.forEach(set => {
        const weight = effectiveWeight(set)

        if (weight === null || !set.reps) return

        const oneRepMax = epley1RM(weight, set.reps)

        if (bestOneRepMax === null || oneRepMax > bestOneRepMax) {
          bestOneRepMax = oneRepMax
          topSet = {weight, reps: set.reps}
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

export const formatCount = (value: number): string => value.toLocaleString('en-US')

/** Parses a yyyy-MM-dd key as a local date (new Date('yyyy-MM-dd') would be UTC). */
export const parseDayKey = (dayKey: string): Date => {
  const [year, month, day] = dayKey.split('-').map(Number)

  return new Date(year, month - 1, day)
}

export interface TopSetTrendPoint {
  date: string
  weight: number
  reps: number
  // est-1RM score of the top set — drives the y-axis so both extra weight and
  // extra reps move the line, while heavy-low-rep sets still outrank light
  // high-rep ones. The card displays the real weight × reps, never this number.
  score: number
}

// Chronological (oldest first) strongest-set points for the trend line — only
// sessions with a weighted set (skips pure-bodyweight/timed days for this exercise).
export function buildTopSetTrend(sessions: SessionSummary[]): TopSetTrendPoint[] {
  return sessions
    .filter((session): session is SessionSummary & {topSet: {weight: number; reps: number}} => session.topSet !== null)
    .map(session => ({
      date: session.date,
      weight: session.topSet.weight,
      reps: session.topSet.reps,
      score: epley1RM(session.topSet.weight, session.topSet.reps)
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1))
}

export interface TrendDelta {
  percent: number
  weeks: number
}

// Percent change in top-set score between the newest and oldest points
// actually available, so the arrow always agrees with the line's direction —
// the label reflects the real window fetched, not a hardcoded "12 weeks" that
// may not match the data on hand.
export function getTopSetDelta(trend: TopSetTrendPoint[]): TrendDelta | null {
  if (trend.length < 2) return null

  const first = trend[0]
  const last = trend[trend.length - 1]
  const daysBetween = (new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 60 * 60 * 24)

  return {
    percent: Math.round(((last.score - first.score) / first.score) * 100),
    weeks: Math.max(1, Math.round(daysBetween / 7))
  }
}

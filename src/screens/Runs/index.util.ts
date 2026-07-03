import type {RunBadge} from './components/RunHistoryListItem'
import {Run} from '@data/models/Run'
import {RunRecord, toRunSummary} from '@data/models/RunRecord'
import {formatDate} from '@utility/DateUtility'
import {getPaceSecondsPerMile} from '@utility/RunUtility'

export interface RunSection {
  title: string
  data: Run[]
}

export interface MergedRuns {
  runs: Run[]
  pendingLocalIds: Set<string>
}

/**
 * Merges server history with not-yet-synced local runs, dropping any local
 * run that already exists remotely. Newest first.
 *
 * A local run matches a server run by remote id, or — for a run whose create
 * succeeded server-side but whose local record never learned its id (app
 * killed mid-sync) — by exact startedAt, since both trace back to the same
 * device record.
 */
export const mergeServerAndPendingRuns = (serverRuns: RunRecord[], pendingLocalRuns: RunRecord[]): MergedRuns => {
  const serverRemoteIds = new Set(serverRuns.map(run => run.id).filter((id): id is string => !!id))
  const serverStartedAts = new Set(serverRuns.map(run => run.startedAt))
  const pendingOnly = pendingLocalRuns.filter(
    run => (!run.id || !serverRemoteIds.has(run.id)) && !serverStartedAts.has(run.startedAt)
  )

  return {
    runs: [...serverRuns, ...pendingOnly].map(toRunSummary).sort((a, b) => b.date - a.date),
    pendingLocalIds: new Set(pendingOnly.map(run => run.localId))
  }
}

export const groupRunsByDate = (runs: Run[]): RunSection[] =>
  Object.values(
    runs.reduce<Record<string, RunSection>>((grouped, run) => {
      const key = formatDate(run.date)

      if (!grouped[key]) {
        grouped[key] = {title: key, data: []}
      }

      grouped[key].data.push(run)

      return grouped
    }, {})
  )

/**
 * Precomputes each run's badge in one pass; best-pace wins when a run holds
 * both records. Zero-distance/zero-duration runs are excluded — their pace of
 * 0 would otherwise numerically beat every real run.
 */
export const buildRunBadges = (history: Run[]): Map<string, RunBadge> => {
  const badges = new Map<string, RunBadge>()
  const rankable = history.filter(run => run.distanceMiles > 0 && run.durationSeconds > 0)

  if (rankable.length === 0) {
    return badges
  }

  const bestPaceRun = rankable.reduce((best, candidate) =>
    getPaceSecondsPerMile(candidate) < getPaceSecondsPerMile(best) ? candidate : best
  )
  const longestRun = rankable.reduce((longest, candidate) =>
    candidate.distanceMiles > longest.distanceMiles ? candidate : longest
  )

  badges.set(bestPaceRun.id, 'best-pace')

  if (!badges.has(longestRun.id)) {
    badges.set(longestRun.id, 'longest')
  }

  return badges
}

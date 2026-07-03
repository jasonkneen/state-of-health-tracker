import {zustandAsyncStorage} from '@store/zustandAsyncStorage'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

/** A single pause window. `end` is undefined while the run is currently paused. */
export type PauseSegment = {
  start: number
  end?: number
}

export type RunSessionStatus = 'idle' | 'active' | 'paused' | 'completed'

export type RunSessionState = {
  runId: string | null
  startTime: number | null
  /** Set when the run completes — recovery needs it to compute the real moving time. */
  endTime: number | null
  pauseSegments: PauseSegment[]
  status: RunSessionStatus
  /** Starts a fresh session record. Called once by RunSessionService.start(). */
  start: (runId: string, startTime?: number) => void
  /** Opens a new pause segment. No-ops unless status is 'active'. */
  pause: () => void
  /** Closes the trailing open pause segment. No-ops unless status is 'paused'. */
  resume: () => void
  /** Closes any trailing open pause segment and marks the session completed. Does not clear runId/pauseSegments — callers should `reset()` once the run is durably saved. */
  complete: () => void
  /** Returns the session record to its idle/empty state. */
  reset: () => void
}

const idleState: Pick<RunSessionState, 'runId' | 'startTime' | 'endTime' | 'pauseSegments' | 'status'> = {
  runId: null,
  startTime: null,
  endTime: null,
  pauseSegments: [],
  status: 'idle'
}

// Durable session record (plan doc §4): survives app kill via the existing
// zustandAsyncStorage adapter. All duration/elapsed-time math derived from
// this state must stay timestamp-based (Date.now() - startTime - pausedMs) —
// never a setInterval accumulator, since that's lost on suspension/kill and
// the plan doc explicitly calls out the old branch's timestamp approach as
// the one thing to keep. See `selectElapsedMs` below for the derivation.
export const useRunSessionStore = create<RunSessionState>()(
  persist(
    (set, get) => ({
      ...idleState,

      start: (runId, startTime = Date.now()) => {
        set({
          runId,
          startTime,
          endTime: null,
          pauseSegments: [],
          status: 'active'
        })
      },

      pause: () => {
        if (get().status !== 'active') {
          return
        }

        set(state => ({
          status: 'paused',
          pauseSegments: [...state.pauseSegments, {start: Date.now()}]
        }))
      },

      resume: () => {
        if (get().status !== 'paused') {
          return
        }

        set(state => {
          const pauseSegments = [...state.pauseSegments]
          const last = pauseSegments[pauseSegments.length - 1]

          if (last && last.end === undefined) {
            pauseSegments[pauseSegments.length - 1] = {...last, end: Date.now()}
          }

          return {status: 'active', pauseSegments}
        })
      },

      complete: () => {
        set(state => {
          const now = Date.now()
          const pauseSegments = [...state.pauseSegments]
          const last = pauseSegments[pauseSegments.length - 1]

          if (last && last.end === undefined) {
            pauseSegments[pauseSegments.length - 1] = {...last, end: now}
          }

          return {status: 'completed', endTime: now, pauseSegments}
        })
      },

      reset: () => {
        set(idleState)
      }
    }),
    {
      name: 'run-session-store',
      storage: zustandAsyncStorage
    }
  )
)

/**
 * Total paused duration in ms as of `now` (defaults to Date.now()). An open
 * trailing pause segment counts up to `now`.
 */
export const selectPausedMs = (state: Pick<RunSessionState, 'pauseSegments'>, now: number = Date.now()): number =>
  state.pauseSegments.reduce((total, segment) => total + ((segment.end ?? now) - segment.start), 0)

/**
 * Elapsed run time in ms, excluding paused time — timestamp-derived so it is
 * correct immediately after resuming from suspension/kill, with no
 * setInterval accumulator involved. Returns 0 if no run has started.
 */
export const selectElapsedMs = (
  state: Pick<RunSessionState, 'startTime' | 'pauseSegments'>,
  now: number = Date.now()
): number => {
  if (state.startTime === null) {
    return 0
  }

  return Math.max(0, now - state.startTime - selectPausedMs(state, now))
}

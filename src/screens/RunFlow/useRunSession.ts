import {useCallback, useEffect, useState} from 'react'

import {processRunPoints, RunStats} from '@service/run/runMath'
import {runPointBuffer} from '@service/run/runPointBuffer'
import {runSessionService} from '@service/run/RunSessionService'
import {selectElapsedMs, useRunSessionStore} from '@store/runSession/useRunSessionStore'
import * as Location from 'expo-location'

import {EMPTY_RUN_STATS} from './index.util'

const LIVE_POLL_INTERVAL_MS = 2500

interface Options {
  /** Awaited once, ahead of the very first background-permission system prompt. */
  onExplainBackgroundPermission: () => Promise<void>
}

/**
 * Owns the live run session for the RunFlow screen: session status, the 1s
 * elapsed tick, the durable-buffer poll for live stats/route, permission
 * state, and the start/pause/resume commands. The screen renders; this hook
 * talks to the session service.
 */
export const useRunSession = ({onExplainBackgroundPermission}: Options) => {
  const status = useRunSessionStore(state => state.status)
  const runId = useRunSessionStore(state => state.runId)
  const isActiveOrPaused = status === 'active' || status === 'paused'

  const [elapsedMs, setElapsedMs] = useState(0)
  const [livePoints, setLivePoints] = useState<Location.LocationObject[]>([])
  const [liveStats, setLiveStats] = useState<RunStats>(EMPTY_RUN_STATS)
  const [hasBackgroundPermission, setHasBackgroundPermission] = useState(true)

  // 1s UI tick for elapsed time — re-derives a timestamp value for display
  // only, never accumulates state (selectElapsedMs is safe every tick).
  useEffect(() => {
    if (!isActiveOrPaused) {
      return
    }

    const tick = () => setElapsedMs(selectElapsedMs(useRunSessionStore.getState()))

    tick()
    const interval = setInterval(tick, 1000)

    return () => clearInterval(interval)
  }, [isActiveOrPaused])

  // Live buffer polling for distance/pace/map. Never the source of truth for
  // the finalized run — that always comes from stop().
  useEffect(() => {
    if (!isActiveOrPaused || !runId) {
      return
    }

    let cancelled = false

    const poll = async () => {
      const raw = await runPointBuffer.readAll(runId)

      if (cancelled) {
        return
      }

      const session = useRunSessionStore.getState()
      const {filteredPoints, stats} = processRunPoints(raw, session.pauseSegments, selectElapsedMs(session))

      setLivePoints(filteredPoints)
      setLiveStats(stats)
    }

    poll()
    const interval = setInterval(poll, LIVE_POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [isActiveOrPaused, runId])

  // Degraded-mode banner: re-check on every status change (e.g. after
  // returning from Settings mid-run).
  useEffect(() => {
    runSessionService.hasBackgroundPermission().then(setHasBackgroundPermission)
  }, [status])

  const startRun = useCallback(async () => {
    // Foreground must be granted before the background ask — iOS can't grant
    // "Always" without "When In Use" first.
    const foregroundStatus = await runSessionService.requestForegroundPermission()

    if (foregroundStatus !== Location.PermissionStatus.GRANTED) {
      throw new Error('Foreground location permission denied.')
    }

    // Background-permission explainer, shown only ahead of the very first
    // system prompt: the status reads UNDETERMINED exactly once per install.
    const backgroundStatus = await runSessionService.getBackgroundPermissionStatus()

    if (backgroundStatus === Location.PermissionStatus.UNDETERMINED) {
      await onExplainBackgroundPermission()
      await runSessionService.requestBackgroundPermission()
    }

    const {hasBackgroundPermission: granted} = await runSessionService.start()

    setHasBackgroundPermission(granted)
  }, [onExplainBackgroundPermission])

  const pauseRun = useCallback(() => runSessionService.pause(), [])
  const resumeRun = useCallback(() => runSessionService.resume(), [])

  return {
    status,
    isActiveOrPaused,
    elapsedMs,
    livePoints,
    liveStats,
    hasBackgroundPermission,
    startRun,
    pauseRun,
    resumeRun
  }
}

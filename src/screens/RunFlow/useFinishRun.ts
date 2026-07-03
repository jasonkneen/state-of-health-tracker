import {useCallback, useState} from 'react'

import {runSessionService} from '@service/run/RunSessionService'
import {buildDraftRunRecord} from '@service/runs/buildDraftRunRecord'
import offlineRunStorageService from '@service/runs/OfflineRunStorageService'
import useAuthStore from '@store/auth/useAuthStore'

import {MIN_SAVEABLE_DISTANCE_METERS} from './index.util'

export type FinishRunOutcome = {kind: 'saved'; localId: string} | {kind: 'too-short'} | {kind: 'no-run'}

/**
 * Owns the two ways a live run ends: finishing (stop → draft → review) and
 * cancelling (stop → discard). The screen just navigates on the outcome.
 */
export const useFinishRun = () => {
  const [isFinishing, setIsFinishing] = useState(false)

  const finishRun = useCallback(async (): Promise<FinishRunOutcome> => {
    setIsFinishing(true)

    try {
      const result = await runSessionService.stop()

      if (!result) {
        return {kind: 'no-run'}
      }

      if (result.stats.distanceMeters < MIN_SAVEABLE_DISTANCE_METERS) {
        await runSessionService.discard(result.runId)

        return {kind: 'too-short'}
      }

      const userId = useAuthStore.getState().userId ?? ''
      const draft = buildDraftRunRecord(userId, {
        runId: result.runId,
        startTime: result.startTime,
        endTime: result.endTime,
        filteredPoints: result.filteredPoints,
        stats: result.stats
      })

      await offlineRunStorageService.save(draft)

      // The session and point buffer are done once the draft is durably
      // saved — leaving them behind would make recovery resurrect this run
      // on every Runs-tab focus.
      await runSessionService.discard(result.runId)

      return {kind: 'saved', localId: draft.localId}
    } finally {
      setIsFinishing(false)
    }
  }, [])

  const cancelRun = useCallback(async () => {
    setIsFinishing(true)

    try {
      const result = await runSessionService.stop()

      if (result) {
        await runSessionService.discard(result.runId)
      }
    } finally {
      setIsFinishing(false)
    }
  }, [])

  return {finishRun, cancelRun, isFinishing}
}

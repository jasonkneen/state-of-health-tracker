import {useCallback, useState} from 'react'

import {RunRecord} from '@data/models/RunRecord'
import {RunsStackParamList} from '@navigation/RunsStack'
import {useSyncOfflineRunsMutation} from '@queries/runs/useSyncOfflineRunsMutation'
import {useFocusEffect, useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {runSessionService} from '@service/run/RunSessionService'
import {buildDraftRunRecord} from '@service/runs/buildDraftRunRecord'
import offlineRunStorageService from '@service/runs/OfflineRunStorageService'
import useAuthStore from '@store/auth/useAuthStore'
import CrashUtility from '@utility/CrashUtility'

import {showToast} from '@components/toast/util/ShowToast'

import Screens from '@constants/screens'
import {RUN_RECOVERED_TOAST} from '@constants/strings'

type RunsNavigationProp = NativeStackNavigationProp<RunsStackParamList, typeof Screens.RUNS>

/**
 * Everything the Runs screen kicks off when it gains focus: the foreground
 * permission pre-request, the pending-local-runs read, crash recovery, and a
 * best-effort background push of unsynced runs. The screen just renders what
 * comes back.
 */
export const useRunsFocusSync = () => {
  const navigation = useNavigation<RunsNavigationProp>()
  const [pendingLocalRuns, setPendingLocalRuns] = useState<RunRecord[]>([])
  const {mutate: syncRuns} = useSyncOfflineRunsMutation()

  const refreshLocalRuns = useCallback(async () => {
    const local = await offlineRunStorageService.readAll()

    setPendingLocalRuns(local.filter(run => !run.synced))
  }, [])

  const handleRecovery = useCallback(async () => {
    const recovery = await runSessionService.recover()

    if (recovery.kind === 'none') {
      return
    }

    if (recovery.kind === 'active-tracking') {
      // The OS kept the background task alive across the app relaunch — go
      // straight back into the live tracking screen, no user decision needed.
      navigation.navigate(Screens.RUN_FLOW)

      return
    }

    // 'stopped-with-buffer' (OS task died / app was killed hard enough to
    // lose it) and 'completed-unsaved' (the app died between stop() and the
    // draft save) both resolve to the same review-then-decide flow: save the
    // same kind of draft RunFlow's own Finish path saves, discard the dead
    // session so this recovery never re-fires, then land on RunSummary in
    // pending mode.
    const userId = useAuthStore.getState().userId ?? ''
    const draft = buildDraftRunRecord(userId, {
      runId: recovery.runId,
      startTime: recovery.startTime,
      endTime: recovery.endTime,
      filteredPoints: recovery.filteredPoints,
      stats: recovery.stats
    })

    await offlineRunStorageService.save(draft)
    await runSessionService.discard(recovery.runId)

    showToast('success', RUN_RECOVERED_TOAST)
    navigation.navigate(Screens.RUN_SUMMARY, {runId: draft.localId, pending: true})
  }, [navigation])

  useFocusEffect(
    useCallback(() => {
      // Request foreground permission as soon as the user enters the Runs
      // feature, not tied to starting a run.
      runSessionService.requestForegroundPermission().catch(error => CrashUtility.recordError(error))

      refreshLocalRuns().catch(error => CrashUtility.recordError(error))
      handleRecovery().catch(error => CrashUtility.recordError(error))

      // Best-effort background push so pending runs clear out of the local
      // bucket on their own; the mutation invalidates the runs query.
      syncRuns(undefined, {onSuccess: () => refreshLocalRuns()})
    }, [refreshLocalRuns, handleRecovery, syncRuns])
  )

  return {pendingLocalRuns, refreshLocalRuns}
}

import React, {useCallback, useEffect, useState} from 'react'

import {SafeAreaView, SectionList, TouchableOpacity, View} from 'react-native'

import {Run} from '@data/models/Run'
import {RunRecord, toRunSummary} from '@data/models/RunRecord'
import {useRunsQuery} from '@queries/runs/useRunsQuery'
import {useFocusEffect, useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {runSessionService} from '@service/run/RunSessionService'
import {buildDraftRunRecord} from '@service/runs/buildDraftRunRecord'
import offlineRunStorageService from '@service/runs/OfflineRunStorageService'
import syncOfflineRuns from '@service/runs/syncOfflineRuns'
import useAuthStore from '@store/auth/useAuthStore'
import {useRunsBetaStore} from '@store/runsBeta/useRunsBetaStore'

import ConfirmModal from '@components/dialog/ConfirmModal'
import {openGlobalBottomSheet} from '@components/GlobalBottomSheet'
import PrimaryButton from '@components/PrimaryButton'
import RunsBetaWarning from '@components/RunsBetaWarning'
import SwipeDeleteListItem from '@components/SwipeDeleteListItem'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import Screens from '@constants/screens'
import {
  RUNS_HISTORY_HEADER,
  RUNS_THIS_MONTH_TEXT,
  RUNS_TITLE,
  START_NEW_RUN_BUTTON_TEXT,
  stringWithParameters
} from '@constants/strings'

import LatestRunCard from './components/LatestRunCard'
import RunHistoryListItem, {RunBadge} from './components/RunHistoryListItem'
import styles from './index.styled'
import {RunsStackParamList} from '../../navigation/RunsStack'
import {formatDate} from '../../utility/DateUtility'
import ListSwipeItemManager from '../../utility/ListSwipeItemManager'
import {getMilesThisMonth, getPaceSecondsPerMile} from '../../utility/RunUtility'

type RunHistoryNavigationProp = NativeStackNavigationProp<RunsStackParamList, typeof Screens.RUNS>

const getBadgeForRun = (run: Run, history: Run[]): RunBadge => {
  const bestPaceRun = history.reduce((best, candidate) =>
    getPaceSecondsPerMile(candidate) < getPaceSecondsPerMile(best) ? candidate : best
  )
  const longestRun = history.reduce((longest, candidate) =>
    candidate.distanceMiles > longest.distanceMiles ? candidate : longest
  )

  if (run.id === bestPaceRun.id) return 'best-pace'
  if (run.id === longestRun.id) return 'longest'

  return undefined
}

const listSwipeItemManager = new ListSwipeItemManager()

const RunsScreen = () => {
  const navigation = useNavigation<RunHistoryNavigationProp>()
  const hasSeenRunsBetaWarning = useRunsBetaStore(state => state.hasSeenRunsBetaWarning)

  const runsQuery = useRunsQuery()
  const [pendingLocalRuns, setPendingLocalRuns] = useState<RunRecord[]>([])
  const [runToDelete, setRunToDelete] = useState<Run | null>(null)

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
    // lose it) and 'completed-unsaved' (stop() ran but discard() never did —
    // e.g. the app died on RunSummary before the user saved) both resolve to
    // the same "review, then save or discard" flow: build the same kind of
    // draft RunFlow's own Finish path builds, then land on RunSummary in
    // pending mode. Re-starting a brand-new run id to "resume" isn't offered
    // here — RunSessionService doesn't support resuming the same OS task, so
    // the safer default is always review-then-decide rather than silently
    // starting a second run.
    const userId = useAuthStore.getState().userId ?? ''
    const draft = buildDraftRunRecord(userId, {
      runId: recovery.runId,
      startTime: recovery.startTime,
      filteredPoints: recovery.filteredPoints,
      stats: recovery.stats
    })

    await offlineRunStorageService.save(draft)
    showToast('success', 'Recovered an interrupted run')
    navigation.navigate(Screens.RUN_SUMMARY, {runId: draft.localId, pending: true})
  }, [navigation])

  useFocusEffect(
    useCallback(() => {
      // Plan doc §3 step 1: request foreground permission as soon as the
      // user enters the Runs feature, not tied to starting a run.
      runSessionService.requestForegroundPermission()

      refreshLocalRuns()
      handleRecovery()

      // Local-first-for-pending, server-is-truth-for-history strategy:
      // OfflineRunStorageService is a sync *queue* (mirrors
      // OfflineWorkoutStorageService — deleteAllSynced sweeps synced rows
      // out), not a permanent local mirror, so the server (useRunsQuery) is
      // the source of truth for history and any not-yet-pushed local runs
      // are merged in below. Kick off a best-effort background push here so
      // pending runs clear out of the "local" bucket on their own.
      syncOfflineRuns()
        .then(refreshLocalRuns)
        .then(() => runsQuery.refetch())
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  useEffect(() => {
    if (hasSeenRunsBetaWarning) {
      return
    }

    const timer = setTimeout(() => openGlobalBottomSheet(<RunsBetaWarning />), 500)

    return () => clearTimeout(timer)
  }, [hasSeenRunsBetaWarning])

  const serverRuns = runsQuery.data ?? []
  const serverRemoteIds = new Set(serverRuns.map(run => run.id).filter((id): id is string => !!id))
  const pendingOnly = pendingLocalRuns.filter(run => !run.id || !serverRemoteIds.has(run.id))
  const pendingLocalIds = new Set(pendingOnly.map(run => run.localId))

  const runs = [...serverRuns, ...pendingOnly].map(toRunSummary).sort((a, b) => b.date - a.date)
  const [latestRun, ...historyRuns] = runs
  const milesThisMonth = getMilesThisMonth(runs)

  const sections = Object.values(
    historyRuns.reduce<Record<string, {title: string; data: Run[]}>>((grouped, run) => {
      const key = formatDate(run.date)

      if (!grouped[key]) {
        grouped[key] = {title: key, data: []}
      }

      grouped[key].data.push(run)

      return grouped
    }, {})
  )

  listSwipeItemManager.setRows(historyRuns)

  const handleRunPress = (run: Run) => {
    navigation.navigate(Screens.RUN_SUMMARY, {runId: run.id, pending: false})
  }

  const handleDeleteRequested = (run: Run) => {
    // Deletion is only wired up for not-yet-synced local runs for now — the
    // backend doesn't expose a DELETE /run/:id endpoint yet, so a synced run
    // can't be removed from here without one.
    if (!pendingLocalIds.has(run.id)) {
      showToast('error', "Synced runs can't be deleted yet")

      return
    }

    setRunToDelete(run)
  }

  const handleDeleteConfirmed = async () => {
    if (runToDelete) {
      await offlineRunStorageService.deleteByLocalId(runToDelete.id)
      await refreshLocalRuns()
    }

    setRunToDelete(null)
  }

  const renderRunRow = (run: Run, index: number, badge: RunBadge) => (
    <SwipeDeleteListItem
      swipeableRef={ref => listSwipeItemManager.setRef(ref, run, index)}
      onSwipeActivated={() => listSwipeItemManager.closeRow(run, index)}
      onDeletePressed={() => handleDeleteRequested(run)}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => handleRunPress(run)}>
        <RunHistoryListItem run={run} badge={badge} />
      </TouchableOpacity>
    </SwipeDeleteListItem>
  )

  if (runs.length === 0) {
    return (
      <SafeAreaView>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{RUNS_TITLE}</Text>
          </View>

          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No runs yet</Text>

            <Text style={styles.emptyText}>Start your first run to begin tracking your progress</Text>
          </View>

          <PrimaryButton
            style={styles.startRunButton}
            label={START_NEW_RUN_BUTTON_TEXT}
            onPress={() => navigation.navigate(Screens.RUN_FLOW)}
          />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView>
      <SectionList
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        sections={sections}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{RUNS_TITLE}</Text>

              <Text style={styles.monthTotal}>
                {stringWithParameters(RUNS_THIS_MONTH_TEXT, milesThisMonth.toFixed(1))}
              </Text>
            </View>

            {latestRun && (
              <TouchableOpacity activeOpacity={0.8} onPress={() => handleRunPress(latestRun)}>
                <LatestRunCard run={latestRun} />
              </TouchableOpacity>
            )}

            {historyRuns.length > 0 && <Text style={styles.historyHeader}>{RUNS_HISTORY_HEADER}</Text>}
          </>
        }
        renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        renderItem={({item, index}) => renderRunRow(item, index, getBadgeForRun(item, historyRuns))}
        ListFooterComponent={
          <PrimaryButton
            style={styles.startRunButton}
            label={START_NEW_RUN_BUTTON_TEXT}
            onPress={() => navigation.navigate(Screens.RUN_FLOW)}
          />
        }
      />

      <ConfirmModal
        confirmationTitle="Delete Run"
        confirmationBody="Are you sure you want to delete this run? This action cannot be undone."
        confirmButtonText="Delete"
        isVisible={!!runToDelete}
        onConfirmPressed={handleDeleteConfirmed}
        onCancel={() => setRunToDelete(null)}
      />
    </SafeAreaView>
  )
}

export default RunsScreen

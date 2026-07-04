import React, {useState} from 'react'

import {ActivityIndicator, SectionList, TouchableOpacity, View} from 'react-native'

import {Run} from '@data/models/Run'
import {RunsStackParamList} from '@navigation/RunsStack'
import {useDiscardRunMutation} from '@queries/runs/useDiscardRunMutation'
import {useRunsQuery} from '@queries/runs/useRunsQuery'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {Theme} from '@styles/theme'
import ListSwipeItemManager from '@utility/ListSwipeItemManager'
import {getMilesThisMonth} from '@utility/RunUtility'
import {SafeAreaView} from 'react-native-safe-area-context'

import ConfirmModal from '@components/dialog/ConfirmModal'
import PrimaryButton from '@components/PrimaryButton'
import SwipeDeleteListItem from '@components/SwipeDeleteListItem'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import Screens from '@constants/screens'
import {
  DELETE_BUTTON_TEXT,
  DELETE_RUN_MODAL_BODY,
  DELETE_RUN_MODAL_TITLE,
  RUNS_HISTORY_HEADER,
  RUNS_SYNCED_DELETE_ERROR,
  RUNS_THIS_MONTH_TEXT,
  RUNS_TITLE,
  START_NEW_RUN_BUTTON_TEXT,
  stringWithParameters,
  TOAST_GENERIC_ERROR
} from '@constants/strings'

import EmptyRunsState from './components/EmptyRunsState'
import LatestRunCard from './components/LatestRunCard'
import RunHistoryListItem, {RunBadge} from './components/RunHistoryListItem'
import styles from './index.styled'
import {buildRunBadges, groupRunsByDate, mergeServerAndPendingRuns} from './index.util'
import {useRunsFocusSync} from './useRunsFocusSync'

type RunHistoryNavigationProp = NativeStackNavigationProp<RunsStackParamList, typeof Screens.RUNS>

const listSwipeItemManager = new ListSwipeItemManager()

const RunsScreen = () => {
  const navigation = useNavigation<RunHistoryNavigationProp>()

  const runsQuery = useRunsQuery()
  const {pendingLocalRuns, refreshLocalRuns} = useRunsFocusSync()
  const discardRunMutation = useDiscardRunMutation()
  const [runToDelete, setRunToDelete] = useState<Run | null>(null)

  const {runs, pendingLocalIds} = mergeServerAndPendingRuns(runsQuery.data ?? [], pendingLocalRuns)
  const [latestRun, ...historyRuns] = runs
  const milesThisMonth = getMilesThisMonth(runs)
  const sections = groupRunsByDate(historyRuns)
  const runBadges = buildRunBadges(historyRuns)

  listSwipeItemManager.setRows(historyRuns)

  const handleRunPress = (run: Run) => {
    navigation.navigate(Screens.RUN_SUMMARY, {runId: run.id, pending: false})
  }

  const handleDeleteRequested = (run: Run) => {
    // Deletion is only wired up for not-yet-synced local runs for now — the
    // backend doesn't expose a DELETE /run/:id endpoint yet, so a synced run
    // can't be removed from here without one.
    if (!pendingLocalIds.has(run.id)) {
      showToast('error', RUNS_SYNCED_DELETE_ERROR)

      return
    }

    setRunToDelete(run)
  }

  const handleDeleteConfirmed = async () => {
    if (runToDelete) {
      try {
        await discardRunMutation.mutateAsync(runToDelete.id)
        await refreshLocalRuns()
      } catch {
        showToast('error', TOAST_GENERIC_ERROR)
      }
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
      <SafeAreaView edges={['top']}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{RUNS_TITLE}</Text>
          </View>

          {runsQuery.isLoading && (
            <View style={styles.emptyContainer}>
              <ActivityIndicator color={Theme.colors.accentGreen} />
            </View>
          )}

          {!runsQuery.isLoading && runsQuery.isError && (
            <TouchableOpacity style={styles.retryContainer} activeOpacity={0.6} onPress={() => runsQuery.refetch()}>
              <Text style={styles.retryText}>{TOAST_GENERIC_ERROR}</Text>
            </TouchableOpacity>
          )}

          {!runsQuery.isLoading && !runsQuery.isError && <EmptyRunsState />}

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
    <SafeAreaView edges={['top']}>
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
        renderItem={({item, index}) => renderRunRow(item, index, runBadges.get(item.id))}
        ListFooterComponent={
          <PrimaryButton
            style={styles.startRunButton}
            label={START_NEW_RUN_BUTTON_TEXT}
            onPress={() => navigation.navigate(Screens.RUN_FLOW)}
          />
        }
      />

      <ConfirmModal
        confirmationTitle={DELETE_RUN_MODAL_TITLE}
        confirmationBody={DELETE_RUN_MODAL_BODY}
        confirmButtonText={DELETE_BUTTON_TEXT}
        isVisible={!!runToDelete}
        onConfirmPressed={handleDeleteConfirmed}
        onCancel={() => setRunToDelete(null)}
      />
    </SafeAreaView>
  )
}

export default RunsScreen

import React from 'react'

import {SafeAreaView, ScrollView, View} from 'react-native'

import {Run} from '@data/models/Run'

import PrimaryButton from '@components/PrimaryButton'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import {
  RUN_TRACKING_COMING_SOON,
  RUNS_HISTORY_HEADER,
  RUNS_THIS_MONTH_TEXT,
  RUNS_TITLE,
  START_NEW_RUN_BUTTON_TEXT,
  stringWithParameters
} from '@constants/strings'

import LatestRunCard from './components/LatestRunCard'
import RunHistoryListItem, {RunBadge} from './components/RunHistoryListItem'
import styles from './index.styled'
import {SAMPLE_RUNS} from './sampleRuns'
import {getMilesThisMonth, getPaceSecondsPerMile} from '../../utility/RunUtility'

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

const RunsScreen = () => {
  const runs = [...SAMPLE_RUNS].sort((a, b) => b.date - a.date)

  const [latestRun, ...historyRuns] = runs
  const milesThisMonth = getMilesThisMonth(runs)

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{RUNS_TITLE}</Text>

            <Text style={styles.monthTotal}>
              {stringWithParameters(RUNS_THIS_MONTH_TEXT, milesThisMonth.toFixed(1))}
            </Text>
          </View>

          {latestRun && <LatestRunCard run={latestRun} />}

          {historyRuns.length > 0 && (
            <>
              <Text style={styles.historyHeader}>{RUNS_HISTORY_HEADER}</Text>

              {historyRuns.map(run => (
                <RunHistoryListItem key={run.id} run={run} badge={getBadgeForRun(run, historyRuns)} />
              ))}
            </>
          )}

          <PrimaryButton
            style={styles.startRunButton}
            label={START_NEW_RUN_BUTTON_TEXT}
            onPress={() => showToast('success', RUN_TRACKING_COMING_SOON)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RunsScreen

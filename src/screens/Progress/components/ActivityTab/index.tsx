import React, {useState} from 'react'

import {Linking, TouchableOpacity, View} from 'react-native'

import {useRequestHealthPermissionsMutation} from '@queries/activity/useRequestHealthPermissionsMutation'
import useUserData from '@store/userData/useUserData'

import StepGoalModal from '@components/dialog/StepGoalModal'
import TargetCaloriesModal from '@components/dialog/TargetCaloriesModal'
import PrimaryButton from '@components/PrimaryButton'
import Text from '@components/Text'
import TickerText from '@components/TickerText'
import {showToast} from '@components/toast/util/ShowToast'

import {
  ACTIVITY_CALORIE_BURN_LABEL,
  ACTIVITY_CONNECT_HEALTH_BODY,
  ACTIVITY_CONNECT_HEALTH_BUTTON,
  ACTIVITY_CONNECT_HEALTH_TITLE,
  ACTIVITY_HEALTH_DENIED_BODY,
  ACTIVITY_HEALTH_DENIED_BUTTON,
  ACTIVITY_HEALTH_DENIED_TITLE,
  ACTIVITY_KCAL_UNIT,
  ACTIVITY_LEGEND_LIFTS,
  ACTIVITY_LEGEND_RUNS,
  ACTIVITY_LEGEND_STEPS,
  ACTIVITY_STEP_GOAL_TEXT,
  ACTIVITY_STEPS_TODAY_LABEL,
  ACTIVITY_TARGET_INTAKE_LABEL,
  ACTIVITY_TARGET_STEPS_LABEL,
  ACTIVITY_TARGETS_LABEL,
  ACTIVITY_THIS_WEEK_HEADER,
  ACTIVITY_EMPTY_WEEK_TEXT,
  ACTIVITY_VS_AVG_TEXT,
  stringWithParameters,
  TOAST_HEALTH_CONNECT_FAILED
} from '@constants/strings'

import styles, {barHeight, progressFillWidth, segmentFlex} from './index.styled'
import {
  buildWeekRows,
  CalorieSegmentKey,
  computeCalorieSegments,
  computeGoalProgress,
  computeStepBars,
  formatCount
} from './index.util'
import useActivitySummary from '../../hooks/useActivitySummary'

const SEGMENT_STYLES: Record<CalorieSegmentKey, object> = {
  lifts: styles.segmentLifts,
  steps: styles.segmentSteps,
  runs: styles.segmentRuns
}

const SEGMENT_LABELS: Record<CalorieSegmentKey, string> = {
  lifts: ACTIVITY_LEGEND_LIFTS,
  steps: ACTIVITY_LEGEND_STEPS,
  runs: ACTIVITY_LEGEND_RUNS
}

const ActivityTab = () => {
  const {stepGoal, targetCalories} = useUserData()
  const summary = useActivitySummary()
  const {mutateAsync: requestPermissionsAsync, isPending: isRequestingPermissions} =
    useRequestHealthPermissionsMutation()

  const [isStepGoalModalVisible, setIsStepGoalModalVisible] = useState(false)
  const [isIntakeModalVisible, setIsIntakeModalVisible] = useState(false)

  const stepBars = computeStepBars(summary.weekSteps, stepGoal)
  const segments = computeCalorieSegments(summary.today.liftKcal, summary.today.stepKcal, summary.today.runKcal)
  const weekRows = buildWeekRows(summary.previousDays, summary.isStepsAvailable)

  const showConnectCard = summary.isStepsAvailable && summary.shouldRequestPermission
  const showDeniedCard = summary.isStepsAvailable && !summary.shouldRequestPermission && !summary.hasStepData
  const showStepsCard = summary.isStepsAvailable && !summary.shouldRequestPermission && summary.hasStepData

  const onConnectPressed = async () => {
    try {
      await requestPermissionsAsync()
    } catch {
      showToast('error', TOAST_HEALTH_CONNECT_FAILED)
    }
  }

  const onOpenSettingsPressed = () => {
    Linking.openSettings()
  }

  return (
    <View>
      {showConnectCard && (
        <View style={styles.card}>
          <Text style={styles.permissionTitle}>{ACTIVITY_CONNECT_HEALTH_TITLE}</Text>

          <Text style={styles.permissionBody}>{ACTIVITY_CONNECT_HEALTH_BODY}</Text>

          <PrimaryButton
            style={styles.permissionButton}
            label={ACTIVITY_CONNECT_HEALTH_BUTTON}
            isLoading={isRequestingPermissions}
            onPress={onConnectPressed}
          />
        </View>
      )}

      {showDeniedCard && (
        <View style={styles.card}>
          <Text style={styles.permissionTitle}>{ACTIVITY_HEALTH_DENIED_TITLE}</Text>

          <Text style={styles.permissionBody}>{ACTIVITY_HEALTH_DENIED_BODY}</Text>

          <PrimaryButton
            style={styles.permissionButton}
            label={ACTIVITY_HEALTH_DENIED_BUTTON}
            onPress={onOpenSettingsPressed}
          />
        </View>
      )}

      {showStepsCard && (
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.label}>{ACTIVITY_STEPS_TODAY_LABEL}</Text>

            {summary.vsAveragePct !== null && (
              <Text style={[styles.vsAvg, summary.vsAveragePct < 0 && styles.vsAvgBehind]}>
                {(summary.vsAveragePct >= 0 ? '▲ ' : '▼ ') +
                  stringWithParameters(ACTIVITY_VS_AVG_TEXT, Math.abs(summary.vsAveragePct).toString())}
              </Text>
            )}
          </View>

          <View style={styles.valueRow}>
            <TickerText text={formatCount(summary.today.steps)} direction={1} style={styles.value} />

            <Text style={styles.unit}>{stringWithParameters(ACTIVITY_STEP_GOAL_TEXT, formatCount(stepGoal))}</Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, progressFillWidth(computeGoalProgress(summary.today.steps, stepGoal))]}
            />
          </View>

          <View style={styles.barsRow}>
            {stepBars.map(bar => (
              <View key={bar.date} style={styles.barColumn}>
                <View style={styles.barArea}>
                  <View
                    style={[
                      styles.bar,
                      bar.hitGoal && styles.barHitGoal,
                      bar.isToday && styles.barToday,
                      barHeight(bar.heightPct)
                    ]}
                  />
                </View>

                <Text style={[styles.barLabel, bar.isToday && styles.barLabelToday]}>{bar.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.label}>{ACTIVITY_CALORIE_BURN_LABEL}</Text>

        <View style={styles.valueRow}>
          <TickerText text={formatCount(summary.today.totalKcal)} direction={1} style={styles.value} />

          <Text style={styles.unit}>{ACTIVITY_KCAL_UNIT}</Text>
        </View>

        {segments.length > 0 && (
          <>
            <View style={styles.segmentBar}>
              {segments.map(segment => (
                <View
                  key={segment.key}
                  style={[styles.segment, SEGMENT_STYLES[segment.key], segmentFlex(segment.kcal)]}
                />
              ))}
            </View>

            <View style={styles.legendRow}>
              {segments.map(segment => (
                <View key={segment.key} style={styles.legendItem}>
                  <View style={[styles.legendDot, SEGMENT_STYLES[segment.key]]} />

                  <Text style={styles.legendLabel}>
                    {`${SEGMENT_LABELS[segment.key]} `}

                    <Text style={styles.legendValue}>{formatCount(segment.kcal)}</Text>
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      <View style={[styles.card, styles.targetsCard]}>
        <Text style={styles.label}>{ACTIVITY_TARGETS_LABEL}</Text>

        <View style={styles.targetsValues}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => setIsStepGoalModalVisible(true)}>
            <Text style={styles.targetText}>
              {`${ACTIVITY_TARGET_STEPS_LABEL} `}

              <Text style={styles.targetValue}>{formatCount(stepGoal)}</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} onPress={() => setIsIntakeModalVisible(true)}>
            <Text style={styles.targetText}>
              {`${ACTIVITY_TARGET_INTAKE_LABEL} `}

              <Text style={styles.targetValue}>{formatCount(targetCalories)}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionHeader}>{ACTIVITY_THIS_WEEK_HEADER}</Text>

      {weekRows.length === 0 ? (
        <Text style={styles.emptyWeekText}>{ACTIVITY_EMPTY_WEEK_TEXT}</Text>
      ) : (
        weekRows.map(row => (
          <View key={row.date} style={styles.weekRow}>
            <View>
              <Text style={styles.weekRowDay}>{row.dayLabel}</Text>

              <Text style={styles.weekRowMeta}>{row.metaText}</Text>
            </View>

            <View style={styles.weekRowRight}>
              <Text style={styles.weekRowKcal}>{row.kcalText}</Text>

              <Text style={styles.weekRowMeta}>{row.breakdownText}</Text>
            </View>
          </View>
        ))
      )}

      <StepGoalModal isVisible={isStepGoalModalVisible} onDismissed={() => setIsStepGoalModalVisible(false)} />

      <TargetCaloriesModal isVisible={isIntakeModalVisible} onDismissed={() => setIsIntakeModalVisible(false)} />
    </View>
  )
}

export default ActivityTab

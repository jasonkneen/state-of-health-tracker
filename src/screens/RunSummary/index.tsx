import React, {useState} from 'react'

import {ActivityIndicator, ScrollView, View} from 'react-native'

import {RunsStackParamList} from '@navigation/RunsStack'
import {useCompleteRunMutation} from '@queries/runs/useCompleteRunMutation'
import {useDiscardRunMutation} from '@queries/runs/useDiscardRunMutation'
import {useRunRecordQuery} from '@queries/runs/useRunRecordQuery'
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {Theme} from '@styles/theme'
import {SafeAreaView} from 'react-native-safe-area-context'

import ConfirmModal from '@components/dialog/ConfirmModal'
import PrimaryButton from '@components/PrimaryButton'
import RunMapView from '@components/RunMapView'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import Screens from '@constants/screens'
import {
  BACK_TO_RUNS_BUTTON_TEXT,
  DISCARD_BUTTON_TEXT,
  DISCARD_RUN_MODAL_BODY,
  DISCARD_RUN_MODAL_TITLE,
  RUN_NOT_FOUND,
  RUN_SAVE_ERROR_TOAST,
  RUN_SAVED_PR_TOAST,
  RUN_SAVED_TOAST,
  SAVE_RUN_BUTTON_TEXT
} from '@constants/strings'

import styles, {confirmButtonBackground} from './index.styled'
import {buildRunSummaryTiles, toRoutePoints} from './index.util'

type RunSummaryNavigationProp = NativeStackNavigationProp<RunsStackParamList, typeof Screens.RUN_SUMMARY>
type RunSummaryRouteProp = RouteProp<RunsStackParamList, typeof Screens.RUN_SUMMARY>

// route.params.pending distinguishes the two ways this screen is reached:
// - pending=true: a run RunFlow (or the Runs screen's crash-recovery flow)
//   just finished and saved as a local draft — offer Save/Discard.
// - pending=false/undefined: an already-saved history run being re-viewed —
//   read-only, loaded local-first (see useRunRecordQuery).
const RunSummaryScreen = () => {
  const navigation = useNavigation<RunSummaryNavigationProp>()
  const route = useRoute<RunSummaryRouteProp>()
  const {runId, pending = false} = route.params

  const {data: record, isLoading} = useRunRecordQuery(runId, pending)
  const completeRunMutation = useCompleteRunMutation()
  const discardRunMutation = useDiscardRunMutation()
  const [isDiscardModalVisible, setIsDiscardModalVisible] = useState(false)

  const handleSave = async () => {
    if (!record) return

    try {
      const result = await completeRunMutation.mutateAsync(record)

      showToast('success', result.newRecords.length > 0 ? RUN_SAVED_PR_TOAST : RUN_SAVED_TOAST)
      navigation.navigate(Screens.RUNS)
    } catch {
      showToast('error', RUN_SAVE_ERROR_TOAST)
    }
  }

  const handleDiscardConfirmed = async () => {
    setIsDiscardModalVisible(false)

    if (record) {
      await discardRunMutation.mutateAsync(record.localId)
    }

    navigation.navigate(Screens.RUNS)
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator color={Theme.colors.accentGreen} />
        </View>
      </SafeAreaView>
    )
  }

  if (!record) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>{RUN_NOT_FOUND}</Text>

          <PrimaryButton label={BACK_TO_RUNS_BUTTON_TEXT} onPress={() => navigation.navigate(Screens.RUNS)} />
        </View>
      </SafeAreaView>
    )
  }

  const startedAt = new Date(record.startedAt)
  const tiles = buildRunSummaryTiles(record)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.mapContainer}>
          <RunMapView route={toRoutePoints(record.routePolyline)} />
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.dateText}>{startedAt.toLocaleDateString()}</Text>

          <Text style={styles.timeText}>{startedAt.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</Text>
        </View>

        <View style={styles.statsGrid}>
          {tiles.map(tile => (
            <View key={tile.label} style={styles.statTile}>
              <Text style={styles.statValue}>{tile.value}</Text>

              <Text style={styles.statLabel}>{tile.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {pending && (
        <View style={styles.actionRow}>
          <PrimaryButton
            width="48%"
            style={confirmButtonBackground(Theme.colors.track)}
            label={DISCARD_BUTTON_TEXT}
            onPress={() => setIsDiscardModalVisible(true)}
          />

          <PrimaryButton
            width="48%"
            isLoading={completeRunMutation.isPending}
            label={SAVE_RUN_BUTTON_TEXT}
            onPress={handleSave}
          />
        </View>
      )}

      <ConfirmModal
        confirmationTitle={DISCARD_RUN_MODAL_TITLE}
        confirmationBody={DISCARD_RUN_MODAL_BODY}
        confirmButtonText={DISCARD_BUTTON_TEXT}
        isVisible={isDiscardModalVisible}
        onConfirmPressed={handleDiscardConfirmed}
        onCancel={() => setIsDiscardModalVisible(false)}
      />
    </SafeAreaView>
  )
}

export default RunSummaryScreen

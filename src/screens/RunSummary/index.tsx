import React, {useEffect, useState} from 'react'

import {ActivityIndicator, SafeAreaView, ScrollView, View} from 'react-native'

import {decodeRoutePolyline, RunRecord} from '@data/models/RunRecord'
import {useCompleteRunMutation} from '@queries/runs/useCompleteRunMutation'
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {runSessionService} from '@service/run/RunSessionService'
import {fetchRun} from '@service/runs/fetchRun'
import offlineRunStorageService from '@service/runs/OfflineRunStorageService'
import {Theme} from '@styles/theme'

import ConfirmModal from '@components/dialog/ConfirmModal'
import PrimaryButton from '@components/PrimaryButton'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import Screens from '@constants/screens'

import styles, {confirmButtonBackground} from './index.styled'
import {RunsStackParamList} from '../../navigation/RunsStack'
import {formatDistanceMiles, formatPaceFromSecPerKm, formatRunDuration, formatSpeedMph} from '../../utility/RunUtility'
import RunMapView from '../RunFlow/components/RunMapView'

type RunSummaryNavigationProp = NativeStackNavigationProp<RunsStackParamList, typeof Screens.RUN_SUMMARY>
type RunSummaryRouteProp = RouteProp<RunsStackParamList, typeof Screens.RUN_SUMMARY>

// route.params.pending distinguishes the two ways this screen is reached:
// - pending=true: a run RunFlow (or RunHistory's crash-recovery flow) just
//   finished and saved as an unsynced draft — offer Save/Discard.
// - pending=false/undefined: an already-saved history run being re-viewed —
//   read-only, loaded from local storage if still queued there, else fetched
//   from the server (local storage is a sync queue, not a permanent mirror —
//   see OfflineRunStorageService/syncOfflineRuns).
const RunSummaryScreen = () => {
  const navigation = useNavigation<RunSummaryNavigationProp>()
  const route = useRoute<RunSummaryRouteProp>()
  const {runId, pending = false} = route.params

  const [record, setRecord] = useState<RunRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDiscardModalVisible, setIsDiscardModalVisible] = useState(false)

  const completeRunMutation = useCompleteRunMutation()

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoading(true)

      const local = await offlineRunStorageService.findLocalRunByLocalId(runId)

      if (local) {
        if (!cancelled) setRecord(local)
      } else if (!pending) {
        try {
          const remote = await fetchRun(runId)

          if (!cancelled) setRecord(remote)
        } catch {
          if (!cancelled) setRecord(null)
        }
      }

      if (!cancelled) setIsLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [runId, pending])

  const handleSave = async () => {
    if (!record) return

    try {
      const result = await completeRunMutation.mutateAsync(record)

      await runSessionService.discard(record.localId)

      showToast('success', result.newRecords.length > 0 ? 'Run saved — new personal record!' : 'Run saved')

      navigation.navigate(Screens.RUNS)
    } catch (error) {
      showToast('error', 'Failed to save run')
    }
  }

  const handleDiscardConfirmed = async () => {
    setIsDiscardModalVisible(false)

    if (record) {
      await runSessionService.discard(record.localId)
      await offlineRunStorageService.deleteByLocalId(record.localId)
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
          <Text style={styles.notFoundText}>Run not found</Text>

          <PrimaryButton label="Back to Runs" onPress={() => navigation.navigate(Screens.RUNS)} />
        </View>
      </SafeAreaView>
    )
  }

  const routePoints = decodeRoutePolyline(record.routePolyline).map(point => ({
    latitude: point.lat,
    longitude: point.lng
  }))
  const avgSpeedMetersPerSecond = record.durationSeconds > 0 ? record.distanceMeters / record.durationSeconds : 0
  const startedAt = new Date(record.startedAt)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.mapContainer}>
          <RunMapView route={routePoints} />
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.dateText}>{startedAt.toLocaleDateString()}</Text>

          <Text style={styles.timeText}>{startedAt.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{formatDistanceMiles(record.distanceMeters)}</Text>

            <Text style={styles.statLabel}>Distance (mi)</Text>
          </View>

          <View style={styles.statTile}>
            <Text style={styles.statValue}>{formatRunDuration(record.durationSeconds)}</Text>

            <Text style={styles.statLabel}>Time</Text>
          </View>

          <View style={styles.statTile}>
            <Text style={styles.statValue}>{formatPaceFromSecPerKm(record.avgPaceSecPerKm ?? 0)}</Text>

            <Text style={styles.statLabel}>Avg Pace</Text>
          </View>

          <View style={styles.statTile}>
            <Text style={styles.statValue}>{formatSpeedMph(avgSpeedMetersPerSecond)}</Text>

            <Text style={styles.statLabel}>Avg Speed (mph)</Text>
          </View>

          <View style={styles.statTile}>
            <Text style={styles.statValue}>{Math.round(record.calories ?? 0)}</Text>

            <Text style={styles.statLabel}>Calories</Text>
          </View>
        </View>
      </ScrollView>

      {pending && (
        <View style={styles.actionRow}>
          <PrimaryButton
            width="48%"
            style={confirmButtonBackground(Theme.colors.track)}
            label="Discard"
            onPress={() => setIsDiscardModalVisible(true)}
          />

          <PrimaryButton width="48%" isLoading={completeRunMutation.isPending} label="Save Run" onPress={handleSave} />
        </View>
      )}

      <ConfirmModal
        confirmationTitle="Discard Run?"
        confirmationBody="This run will be permanently deleted and won't be added to your history."
        confirmButtonText="Discard"
        isVisible={isDiscardModalVisible}
        onConfirmPressed={handleDiscardConfirmed}
        onCancel={() => setIsDiscardModalVisible(false)}
      />
    </SafeAreaView>
  )
}

export default RunSummaryScreen

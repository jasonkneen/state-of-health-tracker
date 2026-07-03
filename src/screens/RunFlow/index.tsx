import React, {useCallback, useEffect, useRef, useState} from 'react'

import {Alert, Animated, BackHandler, SafeAreaView, TouchableOpacity, View} from 'react-native'

import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {processRunPoints, RunStats} from '@service/run/runMath'
import {runPointBuffer} from '@service/run/runPointBuffer'
import {runSessionService, selectElapsedMs} from '@service/run/RunSessionService'
import {buildDraftRunRecord} from '@service/runs/buildDraftRunRecord'
import offlineRunStorageService from '@service/runs/OfflineRunStorageService'
import useAuthStore from '@store/auth/useAuthStore'
import {useRunSessionStore} from '@store/runSession/useRunSessionStore'
import {Theme} from '@styles/theme'
import * as Location from 'expo-location'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import ConfirmModal from '@components/dialog/ConfirmModal'
import PrimaryButton from '@components/PrimaryButton'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import Screens from '@constants/screens'

import RunMapView, {MapPoint} from './components/RunMapView'
import RunStatsDisplay from './components/RunStatsDisplay'
import styles from './index.styled'
import {RunsStackParamList} from '../../navigation/RunsStack'

type RunFlowNavigationProp = NativeStackNavigationProp<RunsStackParamList, typeof Screens.RUN_FLOW>

const LIVE_POLL_INTERVAL_MS = 2500
const COUNTDOWN_STEP_MS = 900
// Below this, a "run" is almost certainly a mis-tap or a GPS warm-up blip,
// not something worth reviewing/saving.
const MIN_SAVEABLE_DISTANCE_METERS = 80

const EMPTY_STATS: RunStats = {
  distanceMeters: 0,
  durationMs: 0,
  avgSpeedMetersPerSecond: 0,
  avgPaceSecondsPerKm: 0,
  calories: 0
}

const toMapPoints = (points: Location.LocationObject[]): MapPoint[] =>
  points.map(point => ({latitude: point.coords.latitude, longitude: point.coords.longitude}))

const RunFlowScreen = () => {
  const navigation = useNavigation<RunFlowNavigationProp>()
  const insets = useSafeAreaInsets()

  const status = useRunSessionStore(state => state.status)
  const runId = useRunSessionStore(state => state.runId)
  const isActiveOrPaused = status === 'active' || status === 'paused'

  // No countdown if we're mounting onto an already-active/paused session —
  // that happens when RunHistory routes here for an 'active-tracking'
  // recovery (the OS kept the background task alive across an app kill).
  const [countdownValue, setCountdownValue] = useState(status === 'idle' ? 3 : 0)
  const [isBusy, setIsBusy] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [hasBackgroundPermission, setHasBackgroundPermission] = useState(true)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [livePoints, setLivePoints] = useState<Location.LocationObject[]>([])
  const [liveStats, setLiveStats] = useState<RunStats>(EMPTY_STATS)
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false)
  const [isFinishModalVisible, setIsFinishModalVisible] = useState(false)

  const countdownScale = useRef(new Animated.Value(1)).current

  const handleStartRun = useCallback(async () => {
    setIsBusy(true)

    try {
      // Background-permission explainer (plan doc §3 step 2), shown only
      // ahead of the very first system prompt: getBackgroundPermissionStatus
      // reads UNDETERMINED exactly once per install. After the user answers
      // (either way) it becomes GRANTED/DENIED and this branch never fires
      // again, so later runs go straight to start() with no extra prompt.
      const backgroundStatus = await runSessionService.getBackgroundPermissionStatus()

      if (backgroundStatus === Location.PermissionStatus.UNDETERMINED) {
        await new Promise<void>(resolve => {
          Alert.alert(
            'Track in the background?',
            'To keep tracking your run when your screen is off or the app is backgrounded, choose "Always Allow" on the next prompt.',
            [{text: 'Continue', onPress: () => resolve()}]
          )
        })
        await runSessionService.requestBackgroundPermission()
      }

      const {hasBackgroundPermission: granted} = await runSessionService.start()

      setHasBackgroundPermission(granted)
    } catch (error) {
      Alert.alert(
        'Location Permission Required',
        'This app needs location access to track your run. Please enable location services in your device settings.'
      )
      navigation.goBack()
    } finally {
      setIsBusy(false)
    }
  }, [navigation])

  // ---- 3-2-1 countdown ----
  useEffect(() => {
    if (countdownValue <= 0) {
      return
    }

    countdownScale.setValue(0.6)
    Animated.spring(countdownScale, {toValue: 1, useNativeDriver: true, friction: 5}).start()

    const timer = setTimeout(() => {
      if (countdownValue === 1) {
        setCountdownValue(0)
        handleStartRun()
      } else {
        setCountdownValue(value => value - 1)
      }
    }, COUNTDOWN_STEP_MS)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdownValue])

  // ---- 1s UI tick for elapsed time — re-derives a timestamp value for
  // display only, never accumulates state (selectElapsedMs is safe every tick). ----
  useEffect(() => {
    if (!isActiveOrPaused) {
      return
    }

    const tick = () => setElapsedMs(selectElapsedMs(useRunSessionStore.getState()))

    tick()
    const interval = setInterval(tick, 1000)

    return () => clearInterval(interval)
  }, [isActiveOrPaused])

  // ---- Live buffer polling for distance/pace/map. Never the source of
  // truth for the finalized run — that always comes from stop(). ----
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
      const {filteredPoints, stats} = processRunPoints(raw, session.pauseSegments)

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

  // ---- Degraded-mode banner: re-check on every status change (e.g. after
  // returning from Settings mid-run). ----
  useEffect(() => {
    runSessionService.hasBackgroundPermission().then(setHasBackgroundPermission)
  }, [status])

  const handlePauseRun = () => runSessionService.pause()
  const handleResumeRun = () => runSessionService.resume()

  const finalizeAndDiscard = useCallback(
    async (reasonToast?: string) => {
      setIsBusy(true)

      try {
        const result = await runSessionService.stop()

        if (result) {
          await runSessionService.discard(result.runId)
        }

        if (reasonToast) {
          showToast('success', reasonToast)
        }
      } finally {
        setIsBusy(false)
        navigation.goBack()
      }
    },
    [navigation]
  )

  const handleFinishRunConfirmed = useCallback(async () => {
    setIsFinishModalVisible(false)
    setIsBusy(true)

    try {
      const result = await runSessionService.stop()

      if (!result) {
        navigation.goBack()

        return
      }

      if (result.stats.distanceMeters < MIN_SAVEABLE_DISTANCE_METERS) {
        await runSessionService.discard(result.runId)
        showToast('success', 'Run was too short to save')
        navigation.goBack()

        return
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

      navigation.replace(Screens.RUN_SUMMARY, {runId: draft.localId, pending: true})
    } catch (error) {
      Alert.alert('Error', 'Failed to save run. Please try again.')
    } finally {
      setIsBusy(false)
    }
  }, [navigation])

  const handleCancelRunConfirmed = useCallback(() => {
    setIsCancelModalVisible(false)
    finalizeAndDiscard()
  }, [finalizeAndDiscard])

  const handleBackPress = useCallback(() => {
    if (!isActiveOrPaused) {
      navigation.goBack()

      return
    }

    Alert.alert('Run in Progress', 'You have an active run. What would you like to do?', [
      {text: 'Continue Running', style: 'cancel'},
      {
        text: 'Pause & Exit',
        onPress: () => {
          runSessionService.pause()
          navigation.goBack()
        }
      },
      {text: 'Finish Run', onPress: () => setIsFinishModalVisible(true)},
      {text: 'Cancel Run', style: 'destructive', onPress: () => setIsCancelModalVisible(true)}
    ])
  }, [isActiveOrPaused, navigation])

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackPress()

      return true
    })

    return () => subscription.remove()
  }, [handleBackPress])

  const displayStats = isActiveOrPaused ? liveStats : EMPTY_STATS

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Run</Text>

        {isActiveOrPaused && (
          <>
            <TouchableOpacity style={styles.topLeftSecondButton} onPress={() => setIsCancelModalVisible(true)}>
              <Ionicons name="close" size={20} color={Theme.colors.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.topLeftButton}
              onPress={status === 'paused' ? handleResumeRun : handlePauseRun}>
              <Ionicons name={status === 'paused' ? 'play' : 'pause'} size={20} color={Theme.colors.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.topRightButton} onPress={() => setShowMap(value => !value)}>
              <MaterialCommunityIcons name={showMap ? 'chart-line' : 'map'} size={20} color={Theme.colors.white} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {isActiveOrPaused && !hasBackgroundPermission && (
        <View style={styles.degradedBanner}>
          <Text style={styles.degradedBannerText}>
            Background permission not granted — keep the app open and screen on to keep tracking.
          </Text>
        </View>
      )}

      <View style={styles.contentContainer}>
        {showMap && isActiveOrPaused ? (
          <RunMapView route={toMapPoints(livePoints)} isLive />
        ) : (
          <RunStatsDisplay
            elapsedMs={elapsedMs}
            distanceMeters={displayStats.distanceMeters}
            avgPaceSecPerKm={displayStats.avgPaceSecondsPerKm}
            avgSpeedMetersPerSecond={displayStats.avgSpeedMetersPerSecond}
            calories={displayStats.calories}
            status={status === 'paused' ? 'paused' : 'active'}
          />
        )}
      </View>

      {isActiveOrPaused && (
        <View style={[styles.controlsContainer, {paddingBottom: Math.max(insets.bottom + 20, 40)}]}>
          <PrimaryButton label="Finish Run" isLoading={isBusy} onPress={() => setIsFinishModalVisible(true)} />
        </View>
      )}

      {countdownValue > 0 && (
        <View style={styles.countdownOverlay}>
          <Animated.View style={{transform: [{scale: countdownScale}]}}>
            <Text style={styles.countdownValue}>{countdownValue}</Text>
          </Animated.View>

          <Text style={styles.countdownSubtext}>Get ready to run!</Text>
        </View>
      )}

      <ConfirmModal
        confirmationTitle="Cancel Run?"
        confirmationBody="Are you sure you want to cancel your run? All data will be lost and not saved to your history."
        confirmButtonText="Cancel Run"
        isVisible={isCancelModalVisible}
        onConfirmPressed={handleCancelRunConfirmed}
        onCancel={() => setIsCancelModalVisible(false)}
      />

      <ConfirmModal
        confirmationTitle="Finish Run"
        confirmationBody="Ready to finish? You'll get a chance to review your stats before saving."
        confirmButtonText="Finish Run"
        confirmButtonColor={Theme.colors.accentGreen}
        cancelButtonColor={Theme.colors.track}
        isVisible={isFinishModalVisible}
        onConfirmPressed={handleFinishRunConfirmed}
        onCancel={() => setIsFinishModalVisible(false)}
      />
    </SafeAreaView>
  )
}

export default RunFlowScreen

import React, {useCallback, useEffect, useState} from 'react'

import {Alert, BackHandler, TouchableOpacity, View} from 'react-native'

import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import {RunsStackParamList} from '@navigation/RunsStack'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {Theme} from '@styles/theme'
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context'

import ConfirmModal from '@components/dialog/ConfirmModal'
import PrimaryButton from '@components/PrimaryButton'
import RunMapView from '@components/RunMapView'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import Screens from '@constants/screens'
import {
  CANCEL_RUN_BUTTON_TEXT,
  CANCEL_RUN_MODAL_BODY,
  CANCEL_RUN_MODAL_TITLE,
  FINISH_RUN_BUTTON_TEXT,
  FINISH_RUN_MODAL_BODY,
  FINISH_RUN_MODAL_TITLE,
  RUN_BG_PERMISSION_BODY,
  RUN_BG_PERMISSION_CONTINUE,
  RUN_BG_PERMISSION_TITLE,
  RUN_CONTINUE_RUNNING,
  RUN_FLOW_TITLE,
  RUN_IN_PROGRESS_BODY,
  RUN_IN_PROGRESS_TITLE,
  RUN_PAUSE_AND_EXIT,
  RUN_PERMISSION_ERROR_BODY,
  RUN_PERMISSION_ERROR_TITLE,
  RUN_SAVE_ERROR_TOAST,
  RUN_TOO_SHORT_TOAST
} from '@constants/strings'

import DegradedModeBanner from './components/DegradedModeBanner'
import RunCountdownOverlay from './components/RunCountdownOverlay'
import RunStatsDisplay from './components/RunStatsDisplay'
import styles, {controlsContainerPadding} from './index.styled'
import {EMPTY_RUN_STATS, toMapPoints} from './index.util'
import {useFinishRun} from './useFinishRun'
import {useRunSession} from './useRunSession'

type RunFlowNavigationProp = NativeStackNavigationProp<RunsStackParamList, typeof Screens.RUN_FLOW>

const RunFlowScreen = () => {
  const navigation = useNavigation<RunFlowNavigationProp>()
  const insets = useSafeAreaInsets()

  const explainBackgroundPermission = useCallback(
    () =>
      new Promise<void>(resolve => {
        Alert.alert(RUN_BG_PERMISSION_TITLE, RUN_BG_PERMISSION_BODY, [
          {text: RUN_BG_PERMISSION_CONTINUE, onPress: () => resolve()}
        ])
      }),
    []
  )

  const {
    status,
    isActiveOrPaused,
    elapsedMs,
    livePoints,
    liveStats,
    hasBackgroundPermission,
    startRun,
    pauseRun,
    resumeRun
  } = useRunSession({onExplainBackgroundPermission: explainBackgroundPermission})
  const {finishRun, cancelRun, isFinishing} = useFinishRun()

  // No countdown if we're mounting onto an already-active/paused session —
  // that happens when the Runs screen routes here for an 'active-tracking'
  // recovery (the OS kept the background task alive across an app kill).
  const [isCountingDown, setIsCountingDown] = useState(status === 'idle')
  const [showMap, setShowMap] = useState(false)
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false)
  const [isFinishModalVisible, setIsFinishModalVisible] = useState(false)

  const handleCountdownComplete = useCallback(async () => {
    setIsCountingDown(false)

    try {
      await startRun()
    } catch {
      Alert.alert(RUN_PERMISSION_ERROR_TITLE, RUN_PERMISSION_ERROR_BODY)
      navigation.goBack()
    }
  }, [startRun, navigation])

  const handleFinishRunConfirmed = useCallback(async () => {
    setIsFinishModalVisible(false)

    try {
      const outcome = await finishRun()

      if (outcome.kind === 'saved') {
        navigation.replace(Screens.RUN_SUMMARY, {runId: outcome.localId, pending: true})

        return
      }

      if (outcome.kind === 'too-short') {
        showToast('success', RUN_TOO_SHORT_TOAST)
      }

      navigation.goBack()
    } catch {
      showToast('error', RUN_SAVE_ERROR_TOAST)
    }
  }, [finishRun, navigation])

  const handleCancelRunConfirmed = useCallback(async () => {
    setIsCancelModalVisible(false)
    await cancelRun()
    navigation.goBack()
  }, [cancelRun, navigation])

  const handleBackPress = useCallback(() => {
    if (!isActiveOrPaused) {
      navigation.goBack()

      return
    }

    Alert.alert(RUN_IN_PROGRESS_TITLE, RUN_IN_PROGRESS_BODY, [
      {text: RUN_CONTINUE_RUNNING, style: 'cancel'},
      {
        text: RUN_PAUSE_AND_EXIT,
        onPress: () => {
          pauseRun()
          navigation.goBack()
        }
      },
      {text: FINISH_RUN_BUTTON_TEXT, onPress: () => setIsFinishModalVisible(true)},
      {text: CANCEL_RUN_BUTTON_TEXT, style: 'destructive', onPress: () => setIsCancelModalVisible(true)}
    ])
  }, [isActiveOrPaused, navigation, pauseRun])

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackPress()

      return true
    })

    return () => subscription.remove()
  }, [handleBackPress])

  const displayStats = isActiveOrPaused ? liveStats : EMPTY_RUN_STATS

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{RUN_FLOW_TITLE}</Text>

        {isActiveOrPaused && (
          <>
            <TouchableOpacity style={styles.topLeftSecondButton} onPress={() => setIsCancelModalVisible(true)}>
              <Ionicons name="close" size={20} color={Theme.colors.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.topLeftButton} onPress={status === 'paused' ? resumeRun : pauseRun}>
              <Ionicons name={status === 'paused' ? 'play' : 'pause'} size={20} color={Theme.colors.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.topRightButton} onPress={() => setShowMap(value => !value)}>
              <MaterialCommunityIcons name={showMap ? 'chart-line' : 'map'} size={20} color={Theme.colors.white} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {isActiveOrPaused && !hasBackgroundPermission && <DegradedModeBanner />}

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
        <View style={[styles.controlsContainer, controlsContainerPadding(insets.bottom)]}>
          <PrimaryButton
            label={FINISH_RUN_BUTTON_TEXT}
            isLoading={isFinishing}
            onPress={() => setIsFinishModalVisible(true)}
          />
        </View>
      )}

      {isCountingDown && <RunCountdownOverlay onComplete={handleCountdownComplete} />}

      <ConfirmModal
        confirmationTitle={CANCEL_RUN_MODAL_TITLE}
        confirmationBody={CANCEL_RUN_MODAL_BODY}
        confirmButtonText={CANCEL_RUN_BUTTON_TEXT}
        isVisible={isCancelModalVisible}
        onConfirmPressed={handleCancelRunConfirmed}
        onCancel={() => setIsCancelModalVisible(false)}
      />

      <ConfirmModal
        confirmationTitle={FINISH_RUN_MODAL_TITLE}
        confirmationBody={FINISH_RUN_MODAL_BODY}
        confirmButtonText={FINISH_RUN_BUTTON_TEXT}
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

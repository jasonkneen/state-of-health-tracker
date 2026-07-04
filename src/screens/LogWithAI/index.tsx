import React, {useMemo, useState} from 'react'

import {ScrollView, TouchableOpacity, View} from 'react-native'

import {EstimateItem} from '@data/models/MacroEstimate'
import {LogWithAIRouteProp, Navigation} from '@navigation/types'
import {useCreateFoodMutation} from '@queries/foods/useCreateFoodMutation'
import {useAiUsageQuery} from '@queries/macros/useAiUsageQuery'
import {useDailyMacrosQuery} from '@queries/macros/useDailyMacrosQuery'
import {useEstimateMacrosMutation} from '@queries/macros/useEstimateMacrosMutation'
import {useLogMealEntryMutation} from '@queries/macros/useLogMealEntryMutation'
import {useNavigation, useRoute} from '@react-navigation/native'
import {isLogWithAiEnabled} from '@service/remoteConfig/initRemoteConfig'
import {useSessionStore} from '@store/session/useSessionStore'
import {Theme} from '@styles/theme'
import {API_ERROR_CODES, getApiErrorCode} from '@utility/ApiErrorUtility'
import {captureMealPhoto, PhotoSource} from '@utility/PhotoCaptureUtility'
import * as Haptics from 'expo-haptics'
import LinearGradient from 'react-native-linear-gradient'

import InputModal from '@components/dialog/InputModal'
import MicIcon from '@components/icons/MicIcon'
import PrimaryButton from '@components/PrimaryButton'
import SegmentedControl from '@components/SegmentedControl'
import Text from '@components/Text'
import TextInput from '@components/TextInput'
import {showActionToast, showToast} from '@components/toast/util/ShowToast'

import {
  AI_DAILY_LIMIT_TOAST,
  AI_ESTIMATE_HEADER,
  AI_FREE_FOR_NOW_CAPTION,
  AI_UNAVAILABLE_TEXT,
  CONFIRM_BUTTON_TEXT,
  DICTATION_BUTTON_ACCESSIBILITY_LABEL,
  ESTIMATE_ADJUST_TIP,
  ESTIMATE_ERROR_TEXT,
  ESTIMATE_IT_BUTTON_TEXT,
  ESTIMATES_NOT_AUDITS_CAPTION,
  ESTIMATING_TEXT,
  LOG_WITH_AI_PLACEHOLDER,
  LOG_WITH_AI_TITLE,
  PHOTO_LIBRARY_TEXT,
  RE_ESTIMATE_BUTTON_TEXT,
  TAKE_PHOTO_TEXT,
  TOAST_GENERIC_ERROR,
  TOAST_SAVE_AI_FOODS_ADD,
  TOAST_SAVE_AI_FOODS_TITLE,
  TOAST_SAVED_TO_FOODS
} from '@constants/strings'

import EstimateItemRow from './components/EstimateItemRow'
import PhotoChip from './components/PhotoChip'
import {useVoiceDictation} from './hooks/useVoiceDictation'
import styles from './index.styled'
import {
  buildLogEntryPayload,
  formatAddItemsLabel,
  formatAiUsageCaption,
  formatTotalCaloriesLabel,
  MAX_CALORIE_INPUT_LENGTH,
  parseCalorieInput,
  scaleItemToCalories,
  sortMealsBySortOrder,
  sumItemCalories
} from './index.util'

// Not yet in @constants/strings — promote to the Macros strings section when
// it grows constants for these.
const SPARKLE_GLYPH = '✦'
const PHOTO_ONLY_SUMMARY_TEXT = 'Photo'
const TAP_TO_EDIT_HINT = 'Tap to edit and re-estimate'
const CALORIE_INPUT_ERROR = 'Enter a valid calorie amount.'
const MAX_INPUT_LENGTH = 500

type Stage = 'input' | 'review'

const LogWithAIScreen = () => {
  const navigation = useNavigation<Navigation>()
  const route = useRoute<LogWithAIRouteProp>()

  const sessionStartDateIso = useSessionStore(state => state.sessionStartDateIso)

  const {data: dailyMacros} = useDailyMacrosQuery(sessionStartDateIso)
  const {data: aiUsage} = useAiUsageQuery()
  const {mutateAsync: estimateMacros, isPending: isEstimating} = useEstimateMacrosMutation()
  const {mutateAsync: logMealEntry} = useLogMealEntryMutation(sessionStartDateIso)
  const {mutateAsync: createFood} = useCreateFoodMutation()

  const [stage, setStage] = useState<Stage>('input')
  const [text, setText] = useState(route.params?.initialText ?? '')
  const [photo, setPhoto] = useState<string | null>(null)

  const [items, setItems] = useState<EstimateItem[]>([])
  const [notes, setNotes] = useState<string | null>(null)

  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingText, setEditingText] = useState('')
  const [showCalorieError, setShowCalorieError] = useState(false)

  const [selectedMealId, setSelectedMealId] = useState<string | undefined>(route.params?.mealId)
  const [isLogging, setIsLogging] = useState(false)

  const {isDictating, toggleDictation, stopDictation} = useVoiceDictation(text, dictatedText =>
    setText(dictatedText.slice(0, MAX_INPUT_LENGTH))
  )

  const meals = useMemo(() => sortMealsBySortOrder(dailyMacros?.meals ?? []), [dailyMacros?.meals])
  const selectedMeal = meals.find(meal => meal.id === selectedMealId) ?? meals[0]
  const mealOptions = meals.map(meal => ({key: meal.id, label: meal.name}))

  const canEstimate = text.trim().length > 0 || photo !== null
  const totalCalories = sumItemCalories(items)
  const editingItem = editingIndex !== null ? items[editingIndex] : undefined

  const runEstimate = async () => {
    if (!canEstimate || isEstimating) return

    stopDictation()
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    try {
      const estimate = await estimateMacros({
        text: text.trim() || undefined,
        imageBase64: photo ?? undefined
      })

      setItems(estimate.items)
      setNotes(estimate.notes)
      setStage('review')
    } catch (error) {
      const code = getApiErrorCode(error)

      if (code === API_ERROR_CODES.quotaExceeded) {
        showToast('error', AI_DAILY_LIMIT_TOAST)
      } else if (code === API_ERROR_CODES.featureDisabled) {
        showToast('error', AI_UNAVAILABLE_TEXT)
      } else {
        showToast('error', ESTIMATE_ERROR_TEXT)
      }
    }
  }

  const onAttachPhotoPressed = async (source: PhotoSource) => {
    const base64 = await captureMealPhoto(source)

    if (base64) {
      setPhoto(base64)
    }
  }

  const onCaloriePressed = (index: number) => {
    setEditingIndex(index)
    setEditingText(String(items[index].calories))
    setShowCalorieError(false)
  }

  const onCalorieConfirmed = () => {
    const calories = parseCalorieInput(editingText)

    if (calories === null) {
      setShowCalorieError(true)

      return
    }

    setItems(previous =>
      previous.map((item, index) => (index === editingIndex ? scaleItemToCalories(item, calories) : item))
    )
    setEditingIndex(null)
  }

  const saveItemsToFoods = async (savedItems: EstimateItem[]) => {
    try {
      for (const item of savedItems) {
        await createFood({
          name: item.name,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat
        })
      }

      showToast('success', TOAST_SAVED_TO_FOODS)
    } catch (error) {
      showToast('error', TOAST_GENERIC_ERROR)
    }
  }

  const onAddItemsPressed = async () => {
    if (!selectedMeal || items.length === 0 || isLogging) return

    setIsLogging(true)

    try {
      // Sequential on purpose — entries land in the order the estimate listed
      // them. If a later entry fails, earlier ones stay logged (acceptable v1).
      for (const item of items) {
        await logMealEntry({mealId: selectedMeal.id, payload: buildLogEntryPayload(item, photo !== null, text.trim())})
      }

      // Capture the items before navigating — the action toast outlives this
      // screen and offers to save the logged items into the food library.
      const loggedItems = [...items]

      showActionToast(
        TOAST_SAVE_AI_FOODS_TITLE,
        loggedItems.map(item => item.name).join(', '),
        TOAST_SAVE_AI_FOODS_ADD,
        () => saveItemsToFoods(loggedItems)
      )
      navigation.popToTop()
    } catch (error) {
      showToast('error', TOAST_GENERIC_ERROR)
    } finally {
      setIsLogging(false)
    }
  }

  const titleBlock = (
    <View style={styles.titleRow}>
      <LinearGradient
        colors={[Theme.colors.accentGreen, Theme.colors.teal]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientTile}>
        <Text style={styles.gradientTileGlyph}>{SPARKLE_GLYPH}</Text>
      </LinearGradient>

      <Text style={styles.title}>{LOG_WITH_AI_TITLE}</Text>
    </View>
  )

  const onDictatePressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    toggleDictation()
  }

  const inputStage = (
    <>
      <View>
        <TextInput
          style={styles.textInput}
          multiline={true}
          maxLength={MAX_INPUT_LENGTH}
          placeholder={LOG_WITH_AI_PLACEHOLDER}
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity
          style={[styles.micButton, isDictating && styles.micButtonActive]}
          accessibilityLabel={DICTATION_BUTTON_ACCESSIBILITY_LABEL}
          onPress={onDictatePressed}>
          <MicIcon color={isDictating ? Theme.colors.white : Theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {photo ? (
        <PhotoChip onRemove={() => setPhoto(null)} />
      ) : (
        <View style={styles.photoButtonsRow}>
          <TouchableOpacity style={styles.photoButton} onPress={() => onAttachPhotoPressed('camera')}>
            <Text style={styles.photoButtonLabel}>{TAKE_PHOTO_TEXT}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.photoButton} onPress={() => onAttachPhotoPressed('library')}>
            <Text style={styles.photoButtonLabel}>{PHOTO_LIBRARY_TEXT}</Text>
          </TouchableOpacity>
        </View>
      )}

      <PrimaryButton
        style={[styles.estimateButton, !canEstimate && styles.estimateButtonDisabled]}
        label={`${SPARKLE_GLYPH} ${ESTIMATE_IT_BUTTON_TEXT}`}
        isLoading={isEstimating}
        onPress={runEstimate}
      />

      <Text style={styles.caption}>{isEstimating ? ESTIMATING_TEXT : ESTIMATES_NOT_AUDITS_CAPTION}</Text>

      {aiUsage && !aiUsage.unlimited && (
        <Text style={styles.caption}>
          {`${AI_FREE_FOR_NOW_CAPTION} · ${formatAiUsageCaption(aiUsage.used, aiUsage.limit)}`}
        </Text>
      )}
    </>
  )

  const reviewStage = (
    <>
      <TouchableOpacity style={styles.summaryCard} activeOpacity={0.7} onPress={() => setStage('input')}>
        <Text style={styles.summaryText} numberOfLines={2}>
          {text.trim() || PHOTO_ONLY_SUMMARY_TEXT}
        </Text>

        <Text style={styles.summaryHint}>{TAP_TO_EDIT_HINT}</Text>
      </TouchableOpacity>

      <View style={styles.estimateHeaderRow}>
        <Text style={styles.estimateHeaderOverline}>{AI_ESTIMATE_HEADER}</Text>

        <View style={styles.estimateHeaderRule} />

        <Text style={styles.estimateHeaderTotal}>{formatTotalCaloriesLabel(totalCalories)}</Text>
      </View>

      {items.map((item, index) => (
        <EstimateItemRow key={`${item.name}-${index}`} item={item} onCaloriePress={() => onCaloriePressed(index)} />
      ))}

      {notes && <Text style={styles.notes}>{notes}</Text>}

      <View style={styles.tipBanner}>
        <Text style={styles.tipText}>{ESTIMATE_ADJUST_TIP}</Text>
      </View>

      {mealOptions.length > 0 && selectedMeal && (
        <View style={styles.mealSelector}>
          <SegmentedControl options={mealOptions} selected={selectedMeal.id} onChange={setSelectedMealId} />
        </View>
      )}

      <PrimaryButton
        style={[styles.addButton, !selectedMeal && styles.estimateButtonDisabled]}
        label={formatAddItemsLabel(items.length, selectedMeal?.name ?? '')}
        isLoading={isLogging}
        onPress={onAddItemsPressed}
      />

      <TouchableOpacity style={styles.reEstimateButton} onPress={runEstimate}>
        <Text style={styles.reEstimateLabel}>{isEstimating ? ESTIMATING_TEXT : RE_ESTIMATE_BUTTON_TEXT}</Text>
      </TouchableOpacity>
    </>
  )

  if (!isLogWithAiEnabled()) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {titleBlock}

        <Text style={styles.caption}>{AI_UNAVAILABLE_TEXT}</Text>
      </ScrollView>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      {titleBlock}

      {stage === 'input' ? inputStage : reviewStage}

      <InputModal
        isVisible={editingIndex !== null}
        title={editingItem?.name ?? ''}
        buttonText={CONFIRM_BUTTON_TEXT}
        value={editingText}
        onChangeText={setEditingText}
        keyboardType="number-pad"
        maxInputLength={MAX_CALORIE_INPUT_LENGTH}
        showError={showCalorieError}
        errorMessage={CALORIE_INPUT_ERROR}
        onCancel={() => setEditingIndex(null)}
        onButtonPressed={onCalorieConfirmed}
      />
    </ScrollView>
  )
}

export default LogWithAIScreen

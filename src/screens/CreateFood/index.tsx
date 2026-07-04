import React, {useState} from 'react'

import {Alert, ScrollView, TouchableOpacity, View} from 'react-native'

import {FoodSourceEnum} from '@data/models/Food'
import {CreateFoodRouteProp, Navigation} from '@navigation/types'
import {useCreateFoodMutation} from '@queries/foods/useCreateFoodMutation'
import {useScanNutritionLabelMutation} from '@queries/macros/useScanNutritionLabelMutation'
import {useNavigation, useRoute} from '@react-navigation/native'
import {captureMealPhoto, PhotoSource} from '@utility/PhotoCaptureUtility'

import LoadingOverlay from '@components/LoadingOverlay'
import Picker from '@components/Picker'
import PrimaryButton from '@components/PrimaryButton'
import Text from '@components/Text'
import TextInput from '@components/TextInput'
import {showToast} from '@components/toast/util/ShowToast'

import {
  CALORIES_AUTO_LABEL,
  CANCEL_BUTTON_TEXT,
  CREATE_FOOD_BUTTON_TEXT,
  CREATE_FOOD_CARBS_HEADER,
  CREATE_FOOD_FAT_HEADER,
  CREATE_FOOD_NAME_ERROR_TEXT,
  CREATE_FOOD_PROTEIN_ERROR_TEXT,
  CREATE_FOOD_PROTEIN_HEADER,
  FOOD_NAME_HEADER,
  LABEL_SCAN_HINT,
  MACROS_PER_SERVING_HEADER,
  NEW_FOOD_TITLE,
  PHOTO_LIBRARY_TEXT,
  SERVING_HEADER,
  TAKE_PHOTO_TEXT,
  TOAST_GENERIC_ERROR,
  UNIT_HEADER
} from '@constants/strings'

import styles, {createFoodContentWidth} from './index.styled'
import {
  applyScanResultToFields,
  buildUnitPickerItems,
  computeAutoCalories,
  CreateFoodFields,
  macroHeaderLabel,
  NO_UNIT_VALUE,
  parseNumericField,
  sanitizeDecimalInput,
  validateCreateFood
} from './index.util'

type MacroField = 'protein' | 'carbs' | 'fat'

const MACRO_CELLS: {key: MacroField; header: string}[] = [
  {key: 'protein', header: CREATE_FOOD_PROTEIN_HEADER},
  {key: 'carbs', header: CREATE_FOOD_CARBS_HEADER},
  {key: 'fat', header: CREATE_FOOD_FAT_HEADER}
]

const CreateFoodScreen = () => {
  const {goBack} = useNavigation<Navigation>()
  const route = useRoute<CreateFoodRouteProp>()

  const createFoodMutation = useCreateFoodMutation()
  const scanLabelMutation = useScanNutritionLabelMutation()

  const [fields, setFields] = useState<CreateFoodFields>({
    name: route.params?.prefillName ?? '',
    servingAmount: '1',
    servingUnit: NO_UNIT_VALUE,
    protein: '',
    carbs: '',
    fat: '',
    calories: '0'
  })

  const [showNameError, setShowNameError] = useState(false)
  const [showMacrosError, setShowMacrosError] = useState(false)
  const [isScanned, setIsScanned] = useState(false)
  // Picker keeps its value in internal state, so remount it when a scan sets
  // the unit from outside
  const [unitPickerKey, setUnitPickerKey] = useState(0)

  const isBusy = createFoodMutation.isPending || scanLabelMutation.isPending

  const dotStyles: Record<MacroField, object> = {
    protein: styles.dotProtein,
    carbs: styles.dotCarbs,
    fat: styles.dotFat
  }

  const onNameChanged = (text: string) => {
    setFields(current => ({...current, name: text}))
    setShowNameError(false)
  }

  const onServingAmountChanged = (text: string) => {
    setFields(current => ({...current, servingAmount: sanitizeDecimalInput(text)}))
  }

  const onUnitSet = (value: string) => {
    setFields(current => ({...current, servingUnit: value}))
  }

  // Editing any macro recomputes calories; a manual calorie edit sticks until
  // the next macro change
  const onMacroChanged = (key: MacroField) => (text: string) => {
    setFields(current => {
      const next = {...current, [key]: sanitizeDecimalInput(text)}

      return {...next, calories: computeAutoCalories(next.protein, next.carbs, next.fat)}
    })
    setShowMacrosError(false)
  }

  const onCaloriesChanged = (text: string) => {
    setFields(current => ({...current, calories: sanitizeDecimalInput(text)}))
  }

  const runLabelScan = async (source: PhotoSource) => {
    const imageBase64 = await captureMealPhoto(source)

    if (!imageBase64) {
      return
    }

    try {
      const result = await scanLabelMutation.mutateAsync(imageBase64)

      setFields(current => applyScanResultToFields(current, result))
      setIsScanned(true)
      setShowNameError(false)
      setShowMacrosError(false)
      setUnitPickerKey(key => key + 1)
    } catch {
      showToast('error', TOAST_GENERIC_ERROR)
    }
  }

  const onScanHintPressed = () => {
    Alert.alert(LABEL_SCAN_HINT, undefined, [
      {text: TAKE_PHOTO_TEXT, onPress: () => runLabelScan('camera')},
      {text: PHOTO_LIBRARY_TEXT, onPress: () => runLabelScan('library')},
      {text: CANCEL_BUTTON_TEXT, style: 'cancel'}
    ])
  }

  const onCreatePressed = async () => {
    const validation = validateCreateFood(fields.name, fields.protein, fields.carbs, fields.fat)

    setShowNameError(validation.showNameError)
    setShowMacrosError(validation.showMacrosError)

    if (!validation.isValid) {
      return
    }

    try {
      await createFoodMutation.mutateAsync({
        name: fields.name.trim(),
        servingAmount: parseNumericField(fields.servingAmount) || 1,
        servingUnit: fields.servingUnit === NO_UNIT_VALUE ? undefined : fields.servingUnit,
        calories: parseNumericField(fields.calories),
        protein: parseNumericField(fields.protein),
        carbs: parseNumericField(fields.carbs),
        fat: parseNumericField(fields.fat),
        source: isScanned ? FoodSourceEnum.LABEL_SCAN : FoodSourceEnum.MANUAL
      })

      goBack()
    } catch {
      showToast('error', TOAST_GENERIC_ERROR)
    }
  }

  return (
    <>
      {isBusy && <LoadingOverlay />}

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{NEW_FOOD_TITLE}</Text>

        <Text style={styles.fieldLabel}>{FOOD_NAME_HEADER.toUpperCase()}</Text>

        <TextInput value={fields.name} maxLength={30} onChangeText={onNameChanged} />

        {showNameError && <Text style={styles.errorText}>{CREATE_FOOD_NAME_ERROR_TEXT}</Text>}

        <View style={styles.servingRow}>
          <View style={styles.servingColumn}>
            <Text style={styles.fieldLabel}>{SERVING_HEADER.toUpperCase()}</Text>

            <TextInput
              keyboardType="decimal-pad"
              returnKeyType="done"
              value={fields.servingAmount}
              onChangeText={onServingAmountChanged}
            />
          </View>

          <View style={styles.unitColumn}>
            <Text style={styles.fieldLabel}>{UNIT_HEADER.toUpperCase()}</Text>

            <Picker
              key={unitPickerKey}
              initialValue={fields.servingUnit}
              items={buildUnitPickerItems(fields.servingUnit)}
              width={createFoodContentWidth * 0.62}
              onValueSet={onUnitSet}
            />
          </View>
        </View>

        <View style={styles.macrosSection}>
          <Text style={styles.fieldLabel}>{MACROS_PER_SERVING_HEADER.toUpperCase()}</Text>

          <View style={styles.macrosRow}>
            {MACRO_CELLS.map(cell => (
              <View key={cell.key} style={styles.macroCell}>
                <View style={styles.macroCellHeader}>
                  <View style={[styles.macroDot, dotStyles[cell.key]]} />

                  <Text style={styles.macroCellLabel}>{macroHeaderLabel(cell.header)}</Text>
                </View>

                <View style={styles.macroValueRow}>
                  <TextInput
                    style={styles.macroInput}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    placeholder="0"
                    value={fields[cell.key]}
                    onChangeText={onMacroChanged(cell.key)}
                  />

                  <Text style={styles.macroUnitSuffix}>g</Text>
                </View>
              </View>
            ))}
          </View>

          {showMacrosError && <Text style={styles.errorText}>{CREATE_FOOD_PROTEIN_ERROR_TEXT}</Text>}

          <View style={styles.caloriesRow}>
            <Text style={styles.caloriesLabel}>{CALORIES_AUTO_LABEL}</Text>

            <TextInput
              style={styles.caloriesInput}
              keyboardType="number-pad"
              returnKeyType="done"
              value={fields.calories}
              onChangeText={onCaloriesChanged}
            />
          </View>

          <TouchableOpacity style={styles.scanHintCard} activeOpacity={0.7} onPress={onScanHintPressed}>
            <Text style={styles.scanHintGlyph}>✦</Text>

            <Text style={styles.scanHintText}>{LABEL_SCAN_HINT}</Text>
          </TouchableOpacity>

          <PrimaryButton
            style={styles.button}
            label={CREATE_FOOD_BUTTON_TEXT}
            isLoading={createFoodMutation.isPending}
            onPress={onCreatePressed}
          />
        </View>
      </ScrollView>
    </>
  )
}

export default CreateFoodScreen

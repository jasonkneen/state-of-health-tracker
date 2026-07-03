import {LabelScanResult} from '@data/models/MacroEstimate'

import {
  applyScanResultToFields,
  buildUnitPickerItems,
  computeAutoCalories,
  CreateFoodFields,
  macroHeaderLabel,
  NO_UNIT_VALUE,
  parseNumericField,
  sanitizeDecimalInput,
  UNIT_OPTIONS,
  validateCreateFood
} from '../index.util'

const makeFields = (overrides: Partial<CreateFoodFields> = {}): CreateFoodFields => ({
  name: '',
  servingAmount: '1',
  servingUnit: NO_UNIT_VALUE,
  protein: '',
  carbs: '',
  fat: '',
  calories: '0',
  ...overrides
})

const makeScanResult = (overrides: Partial<LabelScanResult> = {}): LabelScanResult => ({
  name: 'Overnight oats',
  servingAmount: 1,
  servingUnit: 'Bowl',
  calories: 345,
  protein: 14,
  carbs: 52,
  fat: 9,
  confidence: 'high',
  ...overrides
})

describe('sanitizeDecimalInput', () => {
  it('strips non-numeric characters', () => {
    expect(sanitizeDecimalInput('12a')).toBe('12')
    expect(sanitizeDecimalInput('-5')).toBe('5')
  })

  it('allows a single decimal point', () => {
    expect(sanitizeDecimalInput('1.5')).toBe('1.5')
    expect(sanitizeDecimalInput('1.2.3')).toBe('1.23')
    expect(sanitizeDecimalInput('.5')).toBe('.5')
  })
})

describe('parseNumericField', () => {
  it('parses decimals and falls back to zero', () => {
    expect(parseNumericField('12.5')).toBe(12.5)
    expect(parseNumericField('')).toBe(0)
    expect(parseNumericField('.')).toBe(0)
  })
})

describe('computeAutoCalories', () => {
  it('applies 4/4/9 and rounds', () => {
    expect(computeAutoCalories('14', '52', '9')).toBe('345')
    expect(computeAutoCalories('0.5', '', '')).toBe('2')
  })

  it('treats empty fields as zero', () => {
    expect(computeAutoCalories('', '', '')).toBe('0')
  })
})

describe('macroHeaderLabel', () => {
  it('drops the gram suffix and uppercases', () => {
    expect(macroHeaderLabel('Protein (g)')).toBe('PROTEIN')
    expect(macroHeaderLabel('Fat (g)')).toBe('FAT')
  })
})

describe('validateCreateFood', () => {
  it('requires a name', () => {
    const validation = validateCreateFood('  ', '10', '0', '0')

    expect(validation.showNameError).toBe(true)
    expect(validation.isValid).toBe(false)
  })

  it('requires at least one macro above zero', () => {
    const validation = validateCreateFood('Oats', '', '0', '')

    expect(validation.showMacrosError).toBe(true)
    expect(validation.isValid).toBe(false)
  })

  it('passes with a name and any single macro', () => {
    const validation = validateCreateFood('Oats', '', '52', '')

    expect(validation).toEqual({showNameError: false, showMacrosError: false, isValid: true})
  })
})

describe('applyScanResultToFields', () => {
  it('prefills every field from a full scan', () => {
    expect(applyScanResultToFields(makeFields(), makeScanResult())).toEqual({
      name: 'Overnight oats',
      servingAmount: '1',
      servingUnit: 'bowl',
      protein: '14',
      carbs: '52',
      fat: '9',
      calories: '345'
    })
  })

  it('leaves fields untouched when scan values are null', () => {
    const fields = makeFields({name: 'My food', servingAmount: '2', servingUnit: 'cup'})

    const applied = applyScanResultToFields(
      fields,
      makeScanResult({name: null, servingAmount: null, servingUnit: null})
    )

    expect(applied.name).toBe('My food')
    expect(applied.servingAmount).toBe('2')
    expect(applied.servingUnit).toBe('cup')
  })

  it('rounds scanned calories', () => {
    expect(applyScanResultToFields(makeFields(), makeScanResult({calories: 344.6})).calories).toBe('345')
  })
})

describe('buildUnitPickerItems', () => {
  it('returns the stock units when the current unit is stock', () => {
    expect(buildUnitPickerItems('cup')).toHaveLength(UNIT_OPTIONS.length)
  })

  it('appends an unknown scanned unit so it stays selectable', () => {
    const items = buildUnitPickerItems('slice')

    expect(items[items.length - 1]).toEqual({label: 'slice', value: 'slice'})
  })
})

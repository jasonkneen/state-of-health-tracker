import {MacroTargets} from '@data/models/Macros'

import {
  calorieBalance,
  FALLBACK_CARBS_TARGET_G,
  FALLBACK_FAT_TARGET_G,
  FALLBACK_PROTEIN_TARGET_G,
  formatCalories,
  progressFraction,
  resolveMacroTargets
} from '../index.util'

const makeTargets = (overrides: Partial<MacroTargets> = {}): MacroTargets => ({
  calories: null,
  protein: null,
  carbs: null,
  fat: null,
  ...overrides
})

describe('resolveMacroTargets', () => {
  it('uses server targets when every field is set', () => {
    const resolved = resolveMacroTargets(makeTargets({calories: 2200, protein: 180, carbs: 250, fat: 70}), 1800)

    expect(resolved).toEqual({calories: 2200, protein: 180, carbs: 250, fat: 70})
  })

  it('falls back to the local calorie target and default gram splits when unset', () => {
    const resolved = resolveMacroTargets(makeTargets(), 1800)

    expect(resolved).toEqual({
      calories: 1800,
      protein: FALLBACK_PROTEIN_TARGET_G,
      carbs: FALLBACK_CARBS_TARGET_G,
      fat: FALLBACK_FAT_TARGET_G
    })
  })

  it('falls back per-field, not all-or-nothing', () => {
    const resolved = resolveMacroTargets(makeTargets({protein: 160}), 2000)

    expect(resolved).toEqual({
      calories: 2000,
      protein: 160,
      carbs: FALLBACK_CARBS_TARGET_G,
      fat: FALLBACK_FAT_TARGET_G
    })
  })
})

describe('progressFraction', () => {
  it('returns the consumed fraction of the target', () => {
    expect(progressFraction(683, 1800)).toBeCloseTo(683 / 1800)
  })

  it('caps at 1 when consumption exceeds the target', () => {
    expect(progressFraction(2500, 1800)).toBe(1)
  })

  it('returns 0 for a zero or negative target', () => {
    expect(progressFraction(100, 0)).toBe(0)
    expect(progressFraction(100, -5)).toBe(0)
  })

  it('returns 0 when nothing is consumed', () => {
    expect(progressFraction(0, 1800)).toBe(0)
  })
})

describe('calorieBalance', () => {
  it('returns the remaining amount when under target', () => {
    expect(calorieBalance(1317, 1800)).toEqual({amount: 483, isOver: false})
  })

  it('returns the overage when past the target', () => {
    expect(calorieBalance(2317, 1800)).toEqual({amount: 517, isOver: true})
  })

  it('treats hitting the target exactly as remaining, not over', () => {
    expect(calorieBalance(1800, 1800)).toEqual({amount: 0, isOver: false})
  })

  it('rounds before comparing so a sub-calorie overage reads as 0 remaining', () => {
    expect(calorieBalance(1800.4, 1800)).toEqual({amount: 0, isOver: false})
  })
})

describe('formatCalories', () => {
  it('adds thousands separators', () => {
    expect(formatCalories(1800)).toBe('1,800')
  })

  it('leaves small values untouched', () => {
    expect(formatCalories(683)).toBe('683')
  })

  it('rounds fractional values', () => {
    expect(formatCalories(1799.6)).toBe('1,800')
  })
})

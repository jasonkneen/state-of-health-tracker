import {
  applyFractionPart,
  buildDonutSegments,
  buildMacroBreakdown,
  dominantMacroKey,
  formatDetailSubtitle,
  formatMacroSummary,
  formatServingsDisplay,
  getFractionalPart,
  isFractionSelected,
  MIN_SERVINGS,
  scaleMacros,
  stepServings
} from '../index.util'

describe('formatServingsDisplay', () => {
  it('renders whole servings without a fraction glyph', () => {
    expect(formatServingsDisplay(1)).toBe('1')
    expect(formatServingsDisplay(3)).toBe('3')
  })

  it('renders known fractions with glyphs', () => {
    expect(formatServingsDisplay(0.25)).toBe('¼')
    expect(formatServingsDisplay(0.33)).toBe('⅓')
    expect(formatServingsDisplay(0.5)).toBe('½')
    expect(formatServingsDisplay(0.66)).toBe('⅔')
    expect(formatServingsDisplay(0.75)).toBe('¾')
  })

  it('combines whole part and fraction glyph', () => {
    expect(formatServingsDisplay(1.5)).toBe('1½')
    expect(formatServingsDisplay(2.75)).toBe('2¾')
    expect(formatServingsDisplay(1.33)).toBe('1⅓')
  })

  it('falls back to decimals for unknown fractions', () => {
    expect(formatServingsDisplay(1.2)).toBe('1.2')
  })
})

describe('stepServings', () => {
  it('steps by 0.5 in both directions', () => {
    expect(stepServings(1, 1)).toBe(1.5)
    expect(stepServings(1.5, -1)).toBe(1)
    expect(stepServings(1.25, 1)).toBe(1.75)
  })

  it('clamps at the minimum servings', () => {
    expect(stepServings(0.5, -1)).toBe(MIN_SERVINGS)
    expect(stepServings(MIN_SERVINGS, -1)).toBe(MIN_SERVINGS)
  })
})

describe('applyFractionPart', () => {
  it('replaces the fractional part and keeps the whole part', () => {
    expect(applyFractionPart(1.5, 0.25)).toBe(1.25)
    expect(applyFractionPart(2, 0.33)).toBe(2.33)
  })

  it('works when there is no whole part', () => {
    expect(applyFractionPart(0.5, 0.75)).toBe(0.75)
  })
})

describe('getFractionalPart / isFractionSelected', () => {
  it('extracts the fractional part without float dust', () => {
    expect(getFractionalPart(1.25)).toBe(0.25)
    expect(getFractionalPart(2)).toBe(0)
  })

  it('matches selected fraction chips', () => {
    expect(isFractionSelected(1.25, 0.25)).toBe(true)
    expect(isFractionSelected(1.33, 0.33)).toBe(true)
    expect(isFractionSelected(1.5, 0.25)).toBe(false)
    expect(isFractionSelected(2, 0.5)).toBe(false)
  })
})

describe('buildMacroBreakdown', () => {
  it('computes calorie shares with 4/4/9 weighting', () => {
    const [protein, carbs, fat] = buildMacroBreakdown(1, 50, 3)

    expect(protein.percent).toBe(2)
    expect(carbs.percent).toBe(87)
    expect(fat.percent).toBe(12)
    expect(protein.grams).toBe(1)
    expect(protein.calorieShare + carbs.calorieShare + fat.calorieShare).toBeCloseTo(1)
  })

  it('returns zero shares when all macros are zero', () => {
    const slices = buildMacroBreakdown(0, 0, 0)

    expect(slices.every(slice => slice.calorieShare === 0 && slice.percent === 0)).toBe(true)
  })
})

describe('dominantMacroKey', () => {
  it('picks the macro contributing the most calories', () => {
    expect(dominantMacroKey(buildMacroBreakdown(1, 50, 3))).toBe('carbs')
    expect(dominantMacroKey(buildMacroBreakdown(35, 0, 4))).toBe('protein')
    expect(dominantMacroKey(buildMacroBreakdown(0, 0, 10))).toBe('fat')
  })
})

describe('buildDonutSegments', () => {
  it('drops zero slices and fills the ring minus gaps', () => {
    const segments = buildDonutSegments(buildMacroBreakdown(10, 0, 10), 0.02)

    expect(segments.map(s => s.key)).toEqual(['protein', 'fat'])

    const totalLength = segments.reduce((sum, s) => sum + s.lengthFraction, 0)

    expect(totalLength).toBeCloseTo(1 - 0.02 * 2)
  })

  it('offsets each segment past the previous one plus a gap', () => {
    const [first, second] = buildDonutSegments(buildMacroBreakdown(10, 10, 0), 0.02)

    expect(first.startFraction).toBe(0)
    expect(second.startFraction).toBeCloseTo(first.lengthFraction + 0.02)
  })

  it('uses no gap for a single visible slice', () => {
    const segments = buildDonutSegments(buildMacroBreakdown(0, 25, 0), 0.02)

    expect(segments).toHaveLength(1)
    expect(segments[0].lengthFraction).toBeCloseTo(1)
  })

  it('returns nothing when every macro is zero', () => {
    expect(buildDonutSegments(buildMacroBreakdown(0, 0, 0))).toEqual([])
  })
})

describe('scaleMacros', () => {
  it('multiplies per-serving values and rounds each', () => {
    const perServing = {calories: 231, protein: 1, carbs: 50, fat: 3}

    expect(scaleMacros(perServing, 1.5)).toEqual({calories: 347, protein: 2, carbs: 75, fat: 5})
  })

  it('is identity-ish at one serving', () => {
    const perServing = {calories: 96, protein: 0, carbs: 24, fat: 0}

    expect(scaleMacros(perServing, 1)).toEqual(perServing)
  })
})

describe('formatMacroSummary', () => {
  it('formats rounded gram amounts', () => {
    expect(formatMacroSummary(1.5, 74.6, 4.5)).toBe('2g P · 75g C · 5g F')
    expect(formatMacroSummary(0, 24, 0)).toBe('0g P · 24g C · 0g F')
  })
})

describe('formatDetailSubtitle', () => {
  it('joins serving text and calories', () => {
    expect(formatDetailSubtitle(null, '1 cup', 231, 'cal per serving')).toBe('1 cup · 231 cal per serving')
  })

  it('leads with the brand when present', () => {
    expect(formatDetailSubtitle('Chobani', '1 cup', 231, 'cal per serving')).toBe(
      'Chobani · 1 cup · 231 cal per serving'
    )
  })

  it('omits the brand and serving text when missing', () => {
    expect(formatDetailSubtitle(null, null, 231, 'cal per serving')).toBe('231 cal per serving')
  })
})

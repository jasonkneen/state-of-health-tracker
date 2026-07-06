import {
  attributableSteps,
  estimateLiftCalories,
  estimateLiftSessionMinutes,
  estimateStepCalories,
  poundsToKilograms
} from '../calorieMath'

const MS_PER_MINUTE = 60_000

describe('poundsToKilograms', () => {
  it('converts pounds to kilograms', () => {
    expect(poundsToKilograms(180)).toBeCloseTo(81.65, 1)
  })

  it('returns 0 for 0', () => {
    expect(poundsToKilograms(0)).toBe(0)
  })
})

describe('estimateLiftSessionMinutes', () => {
  describe('no completed sets', () => {
    it('returns 0 regardless of timestamps', () => {
      expect(estimateLiftSessionMinutes(0, 0, MS_PER_MINUTE * 60)).toBe(0)
    })

    it('returns 0 for negative sets', () => {
      expect(estimateLiftSessionMinutes(-3)).toBe(0)
    })
  })

  describe('fallback (no timestamps)', () => {
    it('estimates 3.5 minutes per set', () => {
      expect(estimateLiftSessionMinutes(12)).toBe(42)
    })

    it('treats null timestamps as missing', () => {
      expect(estimateLiftSessionMinutes(10, null, null)).toBe(35)
    })

    it('treats a completedAt before startedAt as missing', () => {
      expect(estimateLiftSessionMinutes(10, 5000, 4000)).toBe(35)
    })

    it('caps the fallback at the session maximum', () => {
      expect(estimateLiftSessionMinutes(100)).toBe(180)
    })
  })

  describe('wall-clock timestamps', () => {
    it('uses the wall-clock duration when within per-set bounds', () => {
      const startedAt = 0
      const completedAt = 47 * MS_PER_MINUTE

      expect(estimateLiftSessionMinutes(15, startedAt, completedAt)).toBe(47)
    })

    it('clamps up to the per-set minimum for implausibly short sessions', () => {
      expect(estimateLiftSessionMinutes(10, 0, 5 * MS_PER_MINUTE)).toBe(20)
    })

    it('clamps down to the per-set maximum for abandoned sessions', () => {
      expect(estimateLiftSessionMinutes(10, 0, 8 * 60 * MS_PER_MINUTE)).toBe(60)
    })

    it('never exceeds the session maximum even with many sets', () => {
      expect(estimateLiftSessionMinutes(50, 0, 10 * 60 * MS_PER_MINUTE)).toBe(180)
    })
  })
})

describe('estimateLiftCalories', () => {
  it('matches the net MET model for a typical session', () => {
    // 180 lb (81.65 kg) at 3.5 MET net of resting → ~3.57 kcal/min; 47 min ≈ 168 kcal
    expect(estimateLiftCalories(180, 15, 0, 47 * MS_PER_MINUTE)).toBe(168)
  })

  it('returns 0 when no sets were completed', () => {
    expect(estimateLiftCalories(180, 0)).toBe(0)
  })

  it('scales with body weight', () => {
    const lighter = estimateLiftCalories(150, 12)
    const heavier = estimateLiftCalories(200, 12)

    expect(heavier).toBeGreaterThan(lighter)
  })

  it('uses the per-set fallback without timestamps', () => {
    // 12 sets → 42 min × ~3.57 kcal/min ≈ 150 kcal
    expect(estimateLiftCalories(180, 12)).toBe(150)
  })
})

describe('estimateStepCalories', () => {
  it('matches the per-step model', () => {
    // 8,432 steps at 180 lb ≈ 248 kcal (net of resting)
    expect(estimateStepCalories(8432, 180)).toBe(248)
  })

  it('returns 0 for 0 steps', () => {
    expect(estimateStepCalories(0, 180)).toBe(0)
  })

  it('treats negative steps as 0', () => {
    expect(estimateStepCalories(-100, 180)).toBe(0)
  })
})

describe('attributableSteps', () => {
  it('subtracts run-window steps from the total', () => {
    expect(attributableSteps(12000, [8000])).toBe(4000)
  })

  it('sums multiple run windows', () => {
    expect(attributableSteps(15000, [4000, 3000])).toBe(8000)
  })

  it('never goes below 0', () => {
    expect(attributableSteps(5000, [8000])).toBe(0)
  })

  it('ignores negative window values', () => {
    expect(attributableSteps(5000, [-200])).toBe(5000)
  })

  it('returns the total when there were no runs', () => {
    expect(attributableSteps(5000, [])).toBe(5000)
  })
})

import {
  buildAreaPath,
  buildLinePath,
  CHART_PADDING,
  clampScrubIndex,
  computeChartCoords,
  computeReferenceY,
  computeStepX
} from '../index.util'

describe('computeStepX', () => {
  it('returns 0 for a single point', () => {
    expect(computeStepX(1, 100)).toBe(0)
  })

  it('returns 0 for no points', () => {
    expect(computeStepX(0, 100)).toBe(0)
  })

  it('divides the padded width across the gaps between points', () => {
    expect(computeStepX(2, 100)).toBe(100 - CHART_PADDING * 2)
    expect(computeStepX(5, 100)).toBe((100 - CHART_PADDING * 2) / 4)
  })
})

describe('computeChartCoords', () => {
  it('maps min value to the bottom and max value to the top', () => {
    const coords = computeChartCoords(
      [
        {date: '2026-01-01', value: 0},
        {date: '2026-01-02', value: 10}
      ],
      100,
      50,
      0
    )

    expect(coords[0]).toEqual({x: CHART_PADDING, y: 50 - CHART_PADDING})
    expect(coords[1]).toEqual({x: 100 - CHART_PADDING, y: CHART_PADDING})
  })

  it('handles a flat series without dividing by zero', () => {
    const coords = computeChartCoords(
      [
        {date: '2026-01-01', value: 5},
        {date: '2026-01-02', value: 5}
      ],
      100,
      50,
      0
    )

    coords.forEach(coord => {
      expect(Number.isFinite(coord.y)).toBe(true)
      expect(coord.y).toBe(50 - CHART_PADDING)
    })
  })

  it('reserves headroom above the max value when a top inset is passed', () => {
    const points = [
      {date: '2026-01-01', value: 0},
      {date: '2026-01-02', value: 10}
    ]

    const withoutInset = computeChartCoords(points, 100, 50, 0)
    const withInset = computeChartCoords(points, 100, 50, 26)

    expect(withoutInset[1].y).toBe(CHART_PADDING)
    expect(withInset[1].y).toBe(CHART_PADDING + 26)
  })

  it('returns an empty array for no points', () => {
    expect(computeChartCoords([], 100, 50, 0)).toEqual([])
  })

  it('widens the y-range to include a reference value below the series', () => {
    const points = [
      {date: '2026-01-01', value: 10},
      {date: '2026-01-02', value: 20}
    ]

    const coords = computeChartCoords(points, 100, 50, 0, 0)

    // With the reference at 0 the min of the range is 0, so the value-10 point
    // sits mid-range rather than at the bottom
    expect(coords[0].y).toBeLessThan(50 - CHART_PADDING)
    expect(coords[1].y).toBe(CHART_PADDING)
  })
})

describe('computeReferenceY', () => {
  it('maps the reference value with the same scale as the points', () => {
    const points = [
      {date: '2026-01-01', value: 0},
      {date: '2026-01-02', value: 10}
    ]

    expect(computeReferenceY(0, points, 50, 0)).toBe(50 - CHART_PADDING)
    expect(computeReferenceY(10, points, 50, 0)).toBe(CHART_PADDING)
  })

  it('places a reference below the series at the bottom of the chart', () => {
    const points = [
      {date: '2026-01-01', value: 180},
      {date: '2026-01-02', value: 178}
    ]

    expect(computeReferenceY(175, points, 50, 0)).toBe(50 - CHART_PADDING)
  })
})

describe('buildLinePath', () => {
  it('starts with a move command and continues with line commands', () => {
    const path = buildLinePath([
      {x: 6, y: 44},
      {x: 50, y: 20},
      {x: 94, y: 6}
    ])

    expect(path).toBe('M 6 44 L 50 20 L 94 6')
  })

  it('returns an empty string for no coords', () => {
    expect(buildLinePath([])).toBe('')
  })
})

describe('buildAreaPath', () => {
  it('closes the line path down to the baseline and back to the start', () => {
    const path = buildAreaPath(
      [
        {x: 6, y: 44},
        {x: 94, y: 6}
      ],
      50
    )

    expect(path).toBe('M 6 44 L 94 6 L 94 50 L 6 50 Z')
  })
})

describe('clampScrubIndex', () => {
  it('rounds to the nearest point index', () => {
    expect(clampScrubIndex(CHART_PADDING + 44, 88, 2)).toBe(1)
    expect(clampScrubIndex(CHART_PADDING + 43, 88, 2)).toBe(0)
  })

  it('clamps to the first point when x is left of the chart', () => {
    expect(clampScrubIndex(-100, 88, 2)).toBe(0)
  })

  it('clamps to the last point when x is right of the chart', () => {
    expect(clampScrubIndex(10_000, 88, 2)).toBe(1)
  })

  it('returns 0 when stepX is 0', () => {
    expect(clampScrubIndex(50, 0, 1)).toBe(0)
  })
})

export interface LineChartPoint {
  date: string
  value: number
}

export interface ChartCoord {
  x: number
  y: number
}

export const CHART_PADDING = 6

export const computeStepX = (pointCount: number, width: number): number =>
  pointCount > 1 ? (width - CHART_PADDING * 2) / (pointCount - 1) : 0

export const computeChartCoords = (
  points: LineChartPoint[],
  width: number,
  height: number,
  topInset: number
): ChartCoord[] => {
  const values = points.map(point => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = computeStepX(points.length, width)

  return points.map((point, index) => ({
    x: CHART_PADDING + index * stepX,
    y: CHART_PADDING + topInset + (1 - (point.value - min) / range) * (height - CHART_PADDING * 2 - topInset)
  }))
}

export const buildLinePath = (coords: ChartCoord[]): string =>
  coords.map((coord, index) => `${index === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`).join(' ')

export const buildAreaPath = (coords: ChartCoord[], height: number): string => {
  const last = coords[coords.length - 1]

  return `${buildLinePath(coords)} L ${last.x} ${height} L ${coords[0].x} ${height} Z`
}

export const clampScrubIndex = (x: number, stepX: number, pointCount: number): number => {
  'worklet'

  const raw = stepX > 0 ? Math.round((x - CHART_PADDING) / stepX) : 0

  return Math.min(Math.max(raw, 0), pointCount - 1)
}

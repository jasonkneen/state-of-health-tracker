import React, {useState} from 'react'

import {LayoutChangeEvent, View} from 'react-native'

import {Theme} from '@styles/theme'
import * as Haptics from 'expo-haptics'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import Svg, {Circle, Path} from 'react-native-svg'

import Text from '@components/Text'

import styles, {LABEL_WIDTH, SCRUB_DOT_SIZE, SCRUB_LINE_WIDTH} from './index.styled'
import {
  buildAreaPath,
  buildLinePath,
  clampScrubIndex,
  computeChartCoords,
  computeStepX,
  LineChartPoint
} from './index.util'

export type {LineChartPoint} from './index.util'

interface Props {
  points: LineChartPoint[]
  height?: number
  color?: string
  onScrub?: (index: number | null) => void
  // renders a small tag above the active dot (e.g. "1RM 270"); reserves
  // headroom at the top of the chart so the tag never clips
  pointLabel?: (value: number) => string
}

const END_DOT_RADIUS = 4
const SCRUB_SNAP_DURATION_MS = 110
const SCRUB_FADE_DURATION_MS = 90
// Horizontal drags scrub the chart, vertical drags stay with the parent ScrollView
const SCRUB_ACTIVATE_DISTANCE = 6
const SCRUB_FAIL_DISTANCE = 12
const LABEL_HEADROOM = 26

const MiniLineChart = ({points, height = 120, color = Theme.colors.accentGreen, onScrub, pointLabel}: Props) => {
  const [width, setWidth] = useState(0)
  const [labelIndex, setLabelIndex] = useState<number | null>(null)

  const isScrubbing = useSharedValue(false)
  const scrubIndex = useSharedValue(-1)

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)

  const stepX = computeStepX(points.length, width)
  const pointCount = points.length
  const topInset = pointLabel ? LABEL_HEADROOM : 0
  const coords = computeChartCoords(points, width, height, topInset)

  const xs = coords.map(coord => coord.x)
  const ys = coords.map(coord => coord.y)

  const emitScrub = (index: number | null) => {
    if (index !== null) Haptics.selectionAsync()

    setLabelIndex(index)
    onScrub?.(index)
  }

  const setScrubIndexFromX = (x: number) => {
    'worklet'

    if (pointCount === 0) return

    const index = clampScrubIndex(x, stepX, pointCount)

    if (index !== scrubIndex.value) {
      scrubIndex.value = index
      runOnJS(emitScrub)(index)
    }
  }

  const scrubGesture = Gesture.Pan()
    .enabled(!!onScrub)
    .activeOffsetX([-SCRUB_ACTIVATE_DISTANCE, SCRUB_ACTIVATE_DISTANCE])
    .failOffsetY([-SCRUB_FAIL_DISTANCE, SCRUB_FAIL_DISTANCE])
    .onBegin(event => {
      isScrubbing.value = true
      setScrubIndexFromX(event.x)
    })
    .onUpdate(event => setScrubIndexFromX(event.x))
    .onFinalize(() => {
      isScrubbing.value = false
      scrubIndex.value = -1
      runOnJS(emitScrub)(null)
    })

  // While scrubbing the indicator tracks the snapped point; released, the
  // label glides home to the newest point while the line and dot fade out
  const activeCoord = (indexValue: number, scrubbingValue: boolean) => {
    'worklet'

    const lastIndex = xs.length - 1
    const index = scrubbingValue && indexValue >= 0 ? Math.min(indexValue, lastIndex) : lastIndex

    return {x: xs.length > 0 ? xs[index] : 0, y: ys.length > 0 ? ys[index] : 0}
  }

  const scrubLineStyle = useAnimatedStyle(() => {
    const {x} = activeCoord(scrubIndex.value, true)

    return {
      opacity: withTiming(isScrubbing.value ? 1 : 0, {duration: SCRUB_FADE_DURATION_MS}),
      transform: [
        {
          translateX: withTiming(x - SCRUB_LINE_WIDTH / 2, {
            duration: SCRUB_SNAP_DURATION_MS,
            easing: Easing.out(Easing.quad)
          })
        }
      ]
    }
  })

  const scrubDotStyle = useAnimatedStyle(() => {
    const {x, y} = activeCoord(scrubIndex.value, true)

    return {
      opacity: withTiming(isScrubbing.value ? 1 : 0, {duration: SCRUB_FADE_DURATION_MS}),
      transform: [
        {
          translateX: withTiming(x - SCRUB_DOT_SIZE / 2, {
            duration: SCRUB_SNAP_DURATION_MS,
            easing: Easing.out(Easing.quad)
          })
        },
        {
          translateY: withTiming(y - SCRUB_DOT_SIZE / 2, {
            duration: SCRUB_SNAP_DURATION_MS,
            easing: Easing.out(Easing.quad)
          })
        }
      ]
    }
  })

  const labelStyle = useAnimatedStyle(() => {
    const {x, y} = activeCoord(scrubIndex.value, isScrubbing.value)
    const clampedX = Math.min(Math.max(x - LABEL_WIDTH / 2, 0), Math.max(width - LABEL_WIDTH, 0))

    return {
      transform: [
        {translateX: withTiming(clampedX, {duration: SCRUB_SNAP_DURATION_MS, easing: Easing.out(Easing.quad)})},
        {
          translateY: withTiming(y - LABEL_HEADROOM, {
            duration: SCRUB_SNAP_DURATION_MS,
            easing: Easing.out(Easing.quad)
          })
        }
      ]
    }
  })

  if (points.length === 0) return <View style={[styles.wrapper, {height}]} onLayout={onLayout} />

  const linePath = buildLinePath(coords)
  const last = coords[coords.length - 1]
  const areaPath = buildAreaPath(coords, height)
  const labeledPoint =
    labelIndex !== null && labelIndex < points.length ? points[labelIndex] : points[points.length - 1]

  const chart = (
    <View style={[styles.wrapper, {height}]} onLayout={onLayout}>
      {width > 0 && (
        <>
          <Svg width={width} height={height}>
            <Path d={areaPath} fill={color} fillOpacity={0.14} />

            <Path
              d={linePath}
              stroke={color}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <Circle cx={last.x} cy={last.y} r={END_DOT_RADIUS} fill={color} />
          </Svg>

          {onScrub && (
            <>
              <Animated.View pointerEvents="none" style={[styles.scrubLine, {height}, scrubLineStyle]} />

              <Animated.View pointerEvents="none" style={[styles.scrubDot, {backgroundColor: color}, scrubDotStyle]} />
            </>
          )}

          {pointLabel && labeledPoint && (
            <Animated.View pointerEvents="none" style={[styles.pointLabel, labelStyle]}>
              <View style={styles.pointLabelPill}>
                <Text style={styles.pointLabelText}>{pointLabel(labeledPoint.value)}</Text>
              </View>
            </Animated.View>
          )}
        </>
      )}
    </View>
  )

  if (!onScrub) return chart

  return <GestureDetector gesture={scrubGesture}>{chart}</GestureDetector>
}

export default MiniLineChart

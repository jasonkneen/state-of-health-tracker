import React from 'react'

import Svg, {Path, Rect} from 'react-native-svg'

import {IconProps} from './IconProps'

const BarbellIcon = ({color, size = 22, strokeWidth = 2}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={2} y={9} width={4} height={6} rx={1} stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />

    <Rect x={18} y={9} width={4} height={6} rx={1} stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />

    <Path d="M6 12h12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
)

export default BarbellIcon

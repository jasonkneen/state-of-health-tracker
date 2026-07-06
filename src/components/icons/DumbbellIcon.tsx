import React from 'react'

import Svg, {Path, Rect} from 'react-native-svg'

import {IconProps} from './IconProps'

const DumbbellIcon = ({color, size = 17, strokeWidth = 2}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2 12h2M20 12h2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />

    <Rect x={4} y={8} width={3} height={8} rx={1} stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />

    <Rect x={17} y={8} width={3} height={8} rx={1} stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />

    <Path d="M7 12h10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
)

export default DumbbellIcon

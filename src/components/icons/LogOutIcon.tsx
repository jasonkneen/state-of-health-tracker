import React from 'react'

import Svg, {Path} from 'react-native-svg'

import {IconProps} from './IconProps'

const LogOutIcon = ({color, size = 17, strokeWidth = 2}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 4H6.5A2.5 2.5 0 004 6.5v11A2.5 2.5 0 006.5 20H9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />

    <Path
      d="M15 8l4 4-4 4M19 12H9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default LogOutIcon

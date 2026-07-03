import React from 'react'

import Svg, {Path} from 'react-native-svg'

import {IconProps} from '@components/icons/IconProps'

const BowlIcon = ({color, size = 18, strokeWidth = 2}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12a9 9 0 0018 0H3z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path d="M9 8V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />

    <Path d="M15 8V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
)

export default BowlIcon

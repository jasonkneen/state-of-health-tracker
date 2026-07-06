import React from 'react'

import Svg, {Path} from 'react-native-svg'

import {IconProps} from './IconProps'

const PulseIcon = ({color, size = 22, strokeWidth = 2}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 12h4l2.5-7 4 14 2.5-10 2 3h5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default PulseIcon

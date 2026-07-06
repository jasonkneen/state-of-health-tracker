import React from 'react'

import Svg, {Path} from 'react-native-svg'

import {IconProps} from './IconProps'

const MicIcon = ({color, size = 17, strokeWidth = 2}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3a3 3 0 013 3v5a3 3 0 01-6 0V6a3 3 0 013-3z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />

    <Path
      d="M5.5 11a6.5 6.5 0 0013 0"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path d="M12 17.5V21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />

    <Path d="M8.5 21h7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
)

export default MicIcon

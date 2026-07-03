import React from 'react'

import Svg, {Path} from 'react-native-svg'

import {IconProps} from './IconProps'

const FlameIcon = ({color, size = 17, strokeWidth = 2}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3c1.2 3-2.2 4.6-2.2 7.2a2.2 2.2 0 004.4 0c0-.9.4-1.5 1-2.1 1.5 1.4 2.3 3 2.3 4.6a5.5 5.5 0 01-11 0C6.5 8.3 10.9 6.6 12 3z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default FlameIcon

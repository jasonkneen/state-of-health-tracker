import React from 'react'

import Svg, {Path, Rect} from 'react-native-svg'

import {IconProps} from './IconProps'

const ScaleIcon = ({color, size = 17, strokeWidth = 2}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={3.5}
      y={3.5}
      width={17}
      height={17}
      rx={4.5}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />

    <Path d="M8.3 9.5a5.2 5.2 0 017.4 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />

    <Path d="M12 9.8l2.2-2.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
)

export default ScaleIcon

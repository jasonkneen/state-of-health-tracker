import React from 'react'

import Svg, {Circle, Path, Rect} from 'react-native-svg'

import {IconProps} from '@components/icons/IconProps'

const PhotoIcon = ({color, size = 18, strokeWidth = 2}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={4} width={18} height={16} rx={3} stroke={color} strokeWidth={strokeWidth} />

    <Circle cx={9} cy={10} r={1.5} fill={color} />

    <Path
      d="M4 17l4.5-4.5a1.5 1.5 0 012 0L15 17m-2-2l2.5-2.5a1.5 1.5 0 012 0L20 15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default PhotoIcon

import React from 'react'

import Svg, {Circle, Path} from 'react-native-svg'

import {IconProps} from './IconProps'

const CameraIcon = ({color, size = 17, strokeWidth = 2}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9a2 2 0 012-2h1.4l1-1.6A2 2 0 019.1 4.5h5.8a2 2 0 011.7.9l1 1.6H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />

    <Circle cx="12" cy="13" r="3.5" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
)

export default CameraIcon

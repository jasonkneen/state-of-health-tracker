import React from 'react'

import Svg, {Path} from 'react-native-svg'

import {IconProps} from './IconProps'

const DocumentIcon = ({color, size = 17, strokeWidth = 2}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 3h7l4 4v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path d="M14 3v4h4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
)

export default DocumentIcon

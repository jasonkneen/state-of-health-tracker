import React from 'react'

import Svg, {Path} from 'react-native-svg'

import {IconProps} from './IconProps'

const HistoryIcon = ({color, size = 22, strokeWidth = 2}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 20V10M12 20V4M6 20v-6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default HistoryIcon

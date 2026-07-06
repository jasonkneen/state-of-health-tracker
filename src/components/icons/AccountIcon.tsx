import React from 'react'

import Svg, {Circle, Path} from 'react-native-svg'

import {IconProps} from './IconProps'

const AccountIcon = ({color, size = 22, strokeWidth = 2}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={8} r={3.6} stroke={color} strokeWidth={strokeWidth} />

    <Path
      d="M4.5 20c1.4-3.4 4.2-5 7.5-5s6.1 1.6 7.5 5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
)

export default AccountIcon

import React from 'react'

import {View} from 'react-native'

import styles, {tileSize} from './index.styled'

export type IconTileVariant = 'green' | 'teal' | 'danger' | 'neutral'

interface Props {
  children: React.JSX.Element
  variant?: IconTileVariant
  size?: number
}

const IconTile = ({children, variant = 'neutral', size = 32}: Props) => (
  <View style={[styles.tile, styles[variant], tileSize(size)]}>{children}</View>
)

export default IconTile

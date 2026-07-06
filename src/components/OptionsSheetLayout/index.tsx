import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import Text from '@components/Text'

import styles from './index.styled'

export interface SheetOptionItem {
  readonly key: string
  readonly icon: React.JSX.Element
  readonly label: string
  readonly onPress: () => void
}

// Shared layout for global-bottom-sheet option menus so every sheet reads the
// same way: title, optional subtitle, optional preview content, then a
// divider and a menu of option rows.
interface Props {
  readonly title: string
  readonly subtitle?: string
  readonly options: SheetOptionItem[]
  readonly children?: React.ReactNode
}

const OptionsSheetLayout = (props: Props) => {
  const {title, subtitle, options, children} = props

  return (
    <View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      {!!subtitle && (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      )}

      {children}

      <View style={styles.divider} />

      {options.map(option => (
        <TouchableOpacity key={option.key} onPress={option.onPress} activeOpacity={0.7} style={styles.optionRow}>
          {option.icon}

          <Text style={styles.optionLabel}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default OptionsSheetLayout

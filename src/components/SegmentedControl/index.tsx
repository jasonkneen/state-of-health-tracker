import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import Text from '@components/Text'

import styles from './index.styled'

export interface SegmentedControlOption<T extends string> {
  key: T
  label: string
}

interface Props<T extends string> {
  options: SegmentedControlOption<T>[]
  selected: T
  onChange: (key: T) => void
}

const SegmentedControl = <T extends string>({options, selected, onChange}: Props<T>) => (
  <View style={styles.track}>
    {options.map(option => {
      const isSelected = option.key === selected

      return (
        <TouchableOpacity
          key={option.key}
          style={[styles.segment, isSelected && styles.segmentSelected]}
          activeOpacity={0.7}
          onPress={() => onChange(option.key)}>
          <Text style={[styles.label, isSelected && styles.labelSelected]}>{option.label}</Text>
        </TouchableOpacity>
      )
    })}
  </View>
)

export default SegmentedControl

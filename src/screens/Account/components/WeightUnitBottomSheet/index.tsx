import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import {WEIGHT_UNITS, WeightUnit} from '@data/models/WeightUnit'
import {Ionicons} from '@expo/vector-icons'
import useUserData from '@store/userData/useUserData'
import {Theme} from '@styles/theme'

import {closeGlobalBottomSheet} from '@components/GlobalBottomSheet'
import Text from '@components/Text'

import {WEIGHT_UNIT_OPTION_LABELS, WEIGHT_UNIT_SHEET_SUBTITLE, WEIGHT_UNIT_SHEET_TITLE} from '@constants/strings'

import styles from './index.styled'

const CHECK_ICON_SIZE = 22

const WeightUnitBottomSheet = () => {
  const weightUnit = useUserData(state => state.weightUnit)
  const setWeightUnit = useUserData(state => state.setWeightUnit)

  const onUnitPressed = (unit: WeightUnit) => {
    setWeightUnit(unit)
    closeGlobalBottomSheet()
  }

  return (
    <View>
      <Text style={styles.title}>{WEIGHT_UNIT_SHEET_TITLE}</Text>

      <Text style={styles.subtitle}>{WEIGHT_UNIT_SHEET_SUBTITLE}</Text>

      <View style={styles.options}>
        {WEIGHT_UNITS.map(unit => {
          const isSelected = unit === weightUnit

          return (
            <TouchableOpacity
              key={unit}
              style={[styles.row, isSelected && styles.rowSelected]}
              activeOpacity={0.7}
              onPress={() => onUnitPressed(unit)}>
              <Text style={[styles.rowLabel, isSelected && styles.rowLabelSelected]}>
                {WEIGHT_UNIT_OPTION_LABELS[unit]}
              </Text>

              {isSelected && (
                <Ionicons name="checkmark-circle" size={CHECK_ICON_SIZE} color={Theme.colors.accentGreen} />
              )}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

export default WeightUnitBottomSheet

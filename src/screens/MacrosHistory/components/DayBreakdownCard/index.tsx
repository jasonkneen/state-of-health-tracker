import React from 'react'

import {View} from 'react-native'

import {DailySummary} from '@data/models/DailyMacros'

import Text from '@components/Text'

import {CALORIES_COLUMN_LABEL, MEAL_COLUMN_LABEL} from '@constants/strings'

import styles from './index.styled'
import {formatDayTitle, formatMacroLine} from '../../index.util'

interface Props {
  day: DailySummary
}

const DayBreakdownCard = ({day}: Props) => {
  const meals = day.meals ?? []

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.dayColumn}>
          <Text style={styles.dayTitle}>{formatDayTitle(day.date)}</Text>

          <Text style={styles.daySubtitle}>{formatMacroLine(day.protein, day.carbs, day.fat)}</Text>
        </View>

        <Text style={styles.caloriesValue}>{day.calories.toLocaleString()}</Text>
      </View>

      {meals.length > 0 && (
        <>
          <View style={styles.columnLabelRow}>
            <Text style={styles.columnLabel}>{MEAL_COLUMN_LABEL}</Text>

            <Text style={styles.columnLabel}>{CALORIES_COLUMN_LABEL}</Text>
          </View>

          {meals.map((meal, index) => (
            <View key={meal.id} style={[styles.mealRow, index === meals.length - 1 && styles.mealRowLast]}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>

                <Text style={styles.mealMacros}>{formatMacroLine(meal.protein, meal.carbs, meal.fat)}</Text>
              </View>

              <Text style={styles.mealCalories}>{meal.calories.toLocaleString()}</Text>
            </View>
          ))}
        </>
      )}
    </View>
  )
}

export default DayBreakdownCard

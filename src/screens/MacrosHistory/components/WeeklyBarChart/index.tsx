import React from 'react'

import {View} from 'react-native'

import Text from '@components/Text'

import {AVG_CAL_LABEL, GOAL_LABEL_PREFIX, LAST_7_DAYS_HEADER} from '@constants/strings'

import styles, {barHeight, goalLineOffset} from './index.styled'
import {averageCalories, barHeightPct, ChartDay, chartMaxCalories, goalLinePct, isNearGoal} from '../../index.util'

interface Props {
  days: ChartDay[]
  goal: number
}

const WeeklyBarChart = ({days, goal}: Props) => {
  const average = averageCalories(days)
  const chartMax = chartMaxCalories(days, goal)

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.overline}>{LAST_7_DAYS_HEADER}</Text>

        <Text style={styles.goalCaption}>{`${GOAL_LABEL_PREFIX} ${goal.toLocaleString()}`}</Text>
      </View>

      <View style={styles.averageRow}>
        <Text style={styles.averageValue}>{average.toLocaleString()}</Text>

        <Text style={styles.averageLabel}>{AVG_CAL_LABEL}</Text>
      </View>

      <View style={styles.chartArea}>
        <View style={[styles.goalLine, goalLineOffset(goalLinePct(goal, chartMax))]} />

        <View style={styles.barsRow}>
          {days.map(day => (
            <View
              key={day.dateIso}
              style={[
                styles.bar,
                isNearGoal(day.calories, goal) && styles.barNearGoal,
                day.isToday && styles.barToday,
                barHeight(barHeightPct(day.calories, chartMax))
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.labelsRow}>
        {days.map(day => (
          <Text key={day.dateIso} style={[styles.dayLabel, day.isToday && styles.dayLabelToday]}>
            {day.dayOfMonth}
          </Text>
        ))}
      </View>
    </View>
  )
}

export default WeeklyBarChart

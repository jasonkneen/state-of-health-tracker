import React from 'react'

import {View} from 'react-native'

import Text from '@components/Text'

import {
  BURN_INFO_DISCLAIMER,
  BURN_INFO_LIFTS_BODY,
  BURN_INFO_LIFTS_TITLE,
  BURN_INFO_RUNS_BODY,
  BURN_INFO_RUNS_TITLE,
  BURN_INFO_SHEET_SUBTITLE,
  BURN_INFO_SHEET_TITLE,
  BURN_INFO_STEPS_BODY,
  BURN_INFO_STEPS_TITLE
} from '@constants/strings'

import styles from './index.styled'

const SECTIONS = [
  {title: BURN_INFO_LIFTS_TITLE, body: BURN_INFO_LIFTS_BODY, dotStyle: styles.dotLifts},
  {title: BURN_INFO_STEPS_TITLE, body: BURN_INFO_STEPS_BODY, dotStyle: styles.dotSteps},
  {title: BURN_INFO_RUNS_TITLE, body: BURN_INFO_RUNS_BODY, dotStyle: styles.dotRuns}
]

const BurnInfoBottomSheet = () => (
  <View>
    <Text style={styles.title}>{BURN_INFO_SHEET_TITLE}</Text>

    <Text style={styles.subtitle}>{BURN_INFO_SHEET_SUBTITLE}</Text>

    <View style={styles.sections}>
      {SECTIONS.map(section => (
        <View key={section.title} style={styles.sectionRow}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.dot, section.dotStyle]} />

            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>

          <Text style={styles.sectionBody}>{section.body}</Text>
        </View>
      ))}
    </View>

    <Text style={styles.disclaimer}>{BURN_INFO_DISCLAIMER}</Text>
  </View>
)

export default BurnInfoBottomSheet

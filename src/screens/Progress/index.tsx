import React from 'react'

import {ScrollView, View} from 'react-native'

import useProgressStore from '@store/progress/useProgressStore'
import {SafeAreaView} from 'react-native-safe-area-context'

import SegmentedControl from '@components/SegmentedControl'
import Text from '@components/Text'

import {PROGRESS_TAB_ACTIVITY, PROGRESS_TAB_BODY, PROGRESS_TAB_EXERCISES, PROGRESS_TITLE} from '@constants/strings'

import ActivityTab from './components/ActivityTab'
import BodyTab from './components/BodyTab'
import ExercisesTab from './components/ExercisesTab'
import styles from './index.styled'

const SUB_TAB_OPTIONS = [
  {key: 'exercises' as const, label: PROGRESS_TAB_EXERCISES},
  {key: 'body' as const, label: PROGRESS_TAB_BODY},
  {key: 'activity' as const, label: PROGRESS_TAB_ACTIVITY}
]

const ProgressScreen = () => {
  const subTab = useProgressStore(state => state.selectedSubTab)
  const setSubTab = useProgressStore(state => state.setSelectedSubTab)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{PROGRESS_TITLE}</Text>

        <SegmentedControl options={SUB_TAB_OPTIONS} selected={subTab} onChange={setSubTab} />

        <View style={styles.tabContent}>
          {subTab === 'exercises' && <ExercisesTab />}

          {subTab === 'body' && <BodyTab />}

          {subTab === 'activity' && <ActivityTab />}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProgressScreen

import React from 'react'

import {ScrollView, View} from 'react-native'

import useProgressStore from '@store/progress/useProgressStore'
import {SafeAreaView} from 'react-native-safe-area-context'

import SegmentedControl from '@components/SegmentedControl'
import Text from '@components/Text'

import {
  PROGRESS_TAB_BODY,
  PROGRESS_TAB_EXERCISES,
  PROGRESS_TAB_VOLUME,
  PROGRESS_TITLE,
  PROGRESS_VOLUME_COMING_SOON_SUBTITLE
} from '@constants/strings'

import BodyTab from './components/BodyTab'
import ComingSoonPanel from './components/ComingSoonPanel'
import ExercisesTab from './components/ExercisesTab'
import styles from './index.styled'

const SUB_TAB_OPTIONS = [
  {key: 'exercises' as const, label: PROGRESS_TAB_EXERCISES},
  {key: 'volume' as const, label: PROGRESS_TAB_VOLUME},
  {key: 'body' as const, label: PROGRESS_TAB_BODY}
]

const ProgressScreen = () => {
  const {selectedSubTab: subTab, setSelectedSubTab: setSubTab} = useProgressStore()

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{PROGRESS_TITLE}</Text>

        <SegmentedControl options={SUB_TAB_OPTIONS} selected={subTab} onChange={setSubTab} />

        <View style={styles.tabContent}>
          {subTab === 'exercises' && <ExercisesTab />}

          {subTab === 'volume' && <ComingSoonPanel subtitle={PROGRESS_VOLUME_COMING_SOON_SUBTITLE} />}

          {subTab === 'body' && <BodyTab />}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProgressScreen

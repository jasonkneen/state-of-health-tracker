import React, {useState} from 'react'

import {SafeAreaView, ScrollView, View} from 'react-native'

import SegmentedControl from '@components/SegmentedControl'
import Text from '@components/Text'

import {
  PROGRESS_BODY_COMING_SOON_SUBTITLE,
  PROGRESS_TAB_BODY,
  PROGRESS_TAB_EXERCISES,
  PROGRESS_TAB_VOLUME,
  PROGRESS_TITLE,
  PROGRESS_VOLUME_COMING_SOON_SUBTITLE
} from '@constants/strings'

import ComingSoonPanel from './components/ComingSoonPanel'
import ExercisesTab from './components/ExercisesTab'
import styles from './index.styled'

type ProgressSubTab = 'exercises' | 'volume' | 'body'

const SUB_TAB_OPTIONS = [
  {key: 'exercises' as const, label: PROGRESS_TAB_EXERCISES},
  {key: 'volume' as const, label: PROGRESS_TAB_VOLUME},
  {key: 'body' as const, label: PROGRESS_TAB_BODY}
]

const ProgressScreen = () => {
  const [subTab, setSubTab] = useState<ProgressSubTab>('exercises')

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{PROGRESS_TITLE}</Text>

        <SegmentedControl options={SUB_TAB_OPTIONS} selected={subTab} onChange={setSubTab} />

        <View style={styles.tabContent}>
          {subTab === 'exercises' && <ExercisesTab />}

          {subTab === 'volume' && <ComingSoonPanel subtitle={PROGRESS_VOLUME_COMING_SOON_SUBTITLE} />}

          {subTab === 'body' && <ComingSoonPanel subtitle={PROGRESS_BODY_COMING_SOON_SUBTITLE} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProgressScreen

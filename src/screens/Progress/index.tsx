import React, {useEffect} from 'react'

import {ScrollView, useWindowDimensions, View} from 'react-native'

import useProgressStore, {ProgressSubTab} from '@store/progress/useProgressStore'
import Animated, {runOnJS, useAnimatedRef, useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated'
import {SafeAreaView} from 'react-native-safe-area-context'

import SegmentedControl from '@components/SegmentedControl'
import Text from '@components/Text'

import {PROGRESS_TAB_ACTIVITY, PROGRESS_TAB_BODY, PROGRESS_TAB_EXERCISES, PROGRESS_TITLE} from '@constants/strings'

import ActivityTab from './components/ActivityTab'
import BodyTab from './components/BodyTab'
import ExercisesTab from './components/ExercisesTab'
import styles, {pagerPage} from './index.styled'

const SUB_TAB_OPTIONS = [
  {key: 'body' as const, label: PROGRESS_TAB_BODY},
  {key: 'activity' as const, label: PROGRESS_TAB_ACTIVITY},
  {key: 'exercises' as const, label: PROGRESS_TAB_EXERCISES}
]

const ProgressScreen = () => {
  const {width} = useWindowDimensions()
  const subTab = useProgressStore(state => state.selectedSubTab)
  const setSubTab = useProgressStore(state => state.setSelectedSubTab)

  const selectedIndex = Math.max(
    SUB_TAB_OPTIONS.findIndex(option => option.key === subTab),
    0
  )

  const pagerRef = useAnimatedRef<Animated.ScrollView>()
  const scrollProgress = useSharedValue(selectedIndex)

  const onPageSettled = (index: number) => {
    const option = SUB_TAB_OPTIONS[index]

    if (option) setSubTab(option.key)
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollProgress.value = event.contentOffset.x / width
    },
    onMomentumEnd: event => {
      runOnJS(onPageSettled)(Math.round(event.contentOffset.x / width))
    }
  })

  // Keeps the pager on the store's tab — covers taps on the segmented control
  // and cross-screen linking (Add Exercise's "View Progression" selects the
  // exercises tab before navigating here)
  useEffect(() => {
    pagerRef.current?.scrollTo({x: selectedIndex * width, animated: true})
  }, [selectedIndex, width, pagerRef])

  const renderTabPage = (tab: ProgressSubTab) => (
    <ScrollView
      key={tab}
      style={pagerPage(width)}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}>
      {tab === 'exercises' && <ExercisesTab />}

      {tab === 'body' && <BodyTab />}

      {tab === 'activity' && <ActivityTab />}
    </ScrollView>
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{PROGRESS_TITLE}</Text>

        <SegmentedControl
          options={SUB_TAB_OPTIONS}
          selected={subTab}
          onChange={setSubTab}
          scrollProgress={scrollProgress}
        />
      </View>

      <Animated.ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentOffset={{x: selectedIndex * width, y: 0}}
        scrollEventThrottle={16}
        onScroll={scrollHandler}>
        {SUB_TAB_OPTIONS.map(option => renderTabPage(option.key))}
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

export default ProgressScreen

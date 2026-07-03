import React from 'react'

import {ActivityIndicator, Dimensions, FlatList, ListRenderItemInfo, View} from 'react-native'

import {DailySummary} from '@data/models/DailyMacros'
import {useDailyMacrosQuery} from '@queries/macros/useDailyMacrosQuery'
import {useMacrosHistoryInfiniteQuery} from '@queries/macros/useMacrosHistoryInfiniteQuery'
import {useSessionStore} from '@store/session/useSessionStore'
import useUserDataStore from '@store/userData/useUserData'
import BorderRadius from '@styles/borderRadius'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

import Screen from '@components/Screen'
import Skeleton from '@components/Skeleton'
import Text from '@components/Text'

import {
  MACROS_EMPTY_HISTORY_SUBTITLE,
  MACROS_EMPTY_HISTORY_TITLE,
  HISTORY_TITLE,
  PREVIOUS_ENTRIES_HEADER
} from '@constants/strings'

import DaySummaryRow from './components/DaySummaryRow'
import WeeklyBarChart from './components/WeeklyBarChart'
import styles from './index.styled'
import {assembleLast7Days, buildLast7DayKeys} from './index.util'

const SKELETON_WIDTH = Dimensions.get('window').width - Spacing.GUTTER * 2
const SKELETON_CHART_HEIGHT = 216
const SKELETON_ROW_HEIGHT = 76
const SKELETON_ROW_COUNT = 4

const MacrosHistorySkeleton = () => (
  <View>
    <Skeleton
      style={styles.skeletonRow}
      height={SKELETON_CHART_HEIGHT}
      width={SKELETON_WIDTH}
      borderRadius={BorderRadius.CARD_LG}
    />

    {Array.from({length: SKELETON_ROW_COUNT}, (_, index) => (
      <Skeleton
        key={index}
        style={styles.skeletonRow}
        height={SKELETON_ROW_HEIGHT}
        width={SKELETON_WIDTH}
        borderRadius={BorderRadius.CARD}
      />
    ))}
  </View>
)

const MacrosHistory = () => {
  const sessionStartDateIso = useSessionStore(state => state.sessionStartDateIso)
  const targetCalories = useUserDataStore(state => state.targetCalories)
  const {data: todayMacros} = useDailyMacrosQuery(sessionStartDateIso)
  const {data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage} = useMacrosHistoryInfiniteQuery()

  const goal = todayMacros?.targets.calories ?? targetCalories
  const historyDays = data?.pages.flatMap(page => page.days) ?? []
  const chartDays = assembleLast7Days(buildLast7DayKeys(sessionStartDateIso), historyDays)
  const todayKey = sessionStartDateIso.split('T')[0]
  const previousDays = historyDays.filter(day => day.date.split('T')[0] !== todayKey)
  const isEmpty = !isLoading && historyDays.length === 0

  const renderItem = ({item}: ListRenderItemInfo<DailySummary>) => <DaySummaryRow day={item} goal={goal} />

  if (isLoading || isEmpty) {
    return (
      <Screen edges={[]}>
        <View style={styles.listContent}>
          <Text style={styles.title}>{HISTORY_TITLE}</Text>
        </View>

        {isLoading ? (
          <View style={styles.listContent}>
            <MacrosHistorySkeleton />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>{MACROS_EMPTY_HISTORY_TITLE}</Text>

            <Text style={styles.emptySubtitle}>{MACROS_EMPTY_HISTORY_SUBTITLE}</Text>
          </View>
        )}
      </Screen>
    )
  }

  return (
    <Screen edges={[]}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        data={previousDays}
        keyExtractor={day => day.date}
        renderItem={renderItem}
        onEndReachedThreshold={0.75}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>{HISTORY_TITLE}</Text>

            <WeeklyBarChart days={chartDays} goal={goal} />

            {previousDays.length > 0 && <Text style={styles.sectionHeader}>{PREVIOUS_ENTRIES_HEADER}</Text>}
          </>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.footerSpinner} size="small" color={Theme.colors.textSecondary} />
          ) : null
        }
      />
    </Screen>
  )
}

export default MacrosHistory

import React from 'react'

import {Linking, ScrollView, View} from 'react-native'

import {useWorkoutSummariesInfiniteQuery} from '@queries/workouts/useWorkoutSummariesInfiniteQuery'
import useAuthStore from '@store/auth/useAuthStore'
import useUserData from '@store/userData/useUserData'
import {Theme} from '@styles/theme'
import LinearGradient from 'react-native-linear-gradient'
import {SafeAreaView} from 'react-native-safe-area-context'

import BarbellIcon from '@components/icons/BarbellIcon'
import DocumentIcon from '@components/icons/DocumentIcon'
import DumbbellIcon from '@components/icons/DumbbellIcon'
import FlameIcon from '@components/icons/FlameIcon'
import ScaleIcon from '@components/icons/ScaleIcon'
import Text from '@components/Text'

import {
  ACCOUNT_AUTH_SECTION_TITLE,
  ACCOUNT_CURRENT_WEIGHT_LABEL,
  ACCOUNT_DAILY_CALORIES_LABEL,
  ACCOUNT_LOGGED_IN_AS_GUEST,
  GUEST_AVATAR_INITIAL,
  ACCOUNT_PRIVACY_POLICY,
  ACCOUNT_STATS_SECTION_TITLE,
  ACCOUNT_TARGETS_SECTION_TITLE,
  ACCOUNT_TOTAL_WORKOUT_DAYS_LABEL,
  ACCOUNT_WELCOME_TEXT,
  ACCOUNT_WORKOUTS_PER_WEEK_LABEL,
  LBS_SUFFIX
} from '@constants/strings'

import AccountListItem from './components/AccountListItem'
import AuthListItem from './components/AuthListItem'
import DeleteAccountListItem from './components/DeleteAccountListItem'
import styles from './index.styled'

const TILE_ICON_SIZE = 17

const AccountScreen = () => {
  const {currentWeight, targetWorkouts, targetCalories} = useUserData()

  const {userEmail, isAuthed} = useAuthStore()
  const {data: summariesData} = useWorkoutSummariesInfiniteQuery()

  const totalSummaries = summariesData?.pages[0]?.pagination.total ?? 0

  const initials = userEmail?.slice(0, 2).toUpperCase() ?? GUEST_AVATAR_INITIAL

  const openPrivacyPolicy = async () => {
    const privacyPolicy = 'https://www.thestateofhealth.com/privacy-policy'
    const supported = await Linking.canOpenURL(privacyPolicy)

    if (supported) {
      await Linking.openURL(privacyPolicy)
    }
  }

  const header = () => (
    <View style={styles.headerRow}>
      <LinearGradient
        colors={[Theme.colors.lime, Theme.colors.teal]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.avatar}>
        <Text style={styles.avatarInitials}>{initials}</Text>
      </LinearGradient>

      <View>
        <Text style={styles.greeting}>{ACCOUNT_WELCOME_TEXT}</Text>

        <Text style={styles.email}>{isAuthed ? userEmail : ACCOUNT_LOGGED_IN_AS_GUEST}</Text>
      </View>
    </View>
  )

  const targetsSection = () => (
    <>
      <Text style={styles.sectionHeader}>{ACCOUNT_TARGETS_SECTION_TITLE}</Text>

      <View style={styles.groupCard}>
        <AccountListItem
          type="target-calories"
          label={ACCOUNT_DAILY_CALORIES_LABEL}
          value={targetCalories.toLocaleString()}
          tileVariant="danger"
          icon={<FlameIcon color={Theme.colors.danger} size={TILE_ICON_SIZE} />}
        />

        <AccountListItem
          type="target-workouts"
          label={ACCOUNT_WORKOUTS_PER_WEEK_LABEL}
          value={targetWorkouts.toString()}
          tileVariant="green"
          isLastInGroup={true}
          icon={<BarbellIcon color={Theme.colors.accentGreen} size={TILE_ICON_SIZE} />}
        />
      </View>
    </>
  )

  const statsSection = () => (
    <>
      <Text style={styles.sectionHeader}>{ACCOUNT_STATS_SECTION_TITLE}</Text>

      <View style={styles.groupCard}>
        <AccountListItem
          type="weight"
          label={ACCOUNT_CURRENT_WEIGHT_LABEL}
          value={currentWeight + LBS_SUFFIX}
          tileVariant="teal"
          icon={<ScaleIcon color={Theme.colors.teal} size={TILE_ICON_SIZE} />}
        />

        <AccountListItem
          type="info"
          clickable={false}
          label={ACCOUNT_TOTAL_WORKOUT_DAYS_LABEL}
          value={totalSummaries.toString()}
          isLastInGroup={true}
          icon={<DumbbellIcon color={Theme.colors.textSecondary} size={TILE_ICON_SIZE} />}
        />
      </View>
    </>
  )

  const authSection = () => (
    <>
      <Text style={styles.sectionHeader}>{ACCOUNT_AUTH_SECTION_TITLE}</Text>

      <View style={styles.groupCard}>
        <AuthListItem />

        <AccountListItem
          type="info"
          label={ACCOUNT_PRIVACY_POLICY}
          isLastInGroup={!isAuthed}
          icon={<DocumentIcon color={Theme.colors.textSecondary} size={TILE_ICON_SIZE} />}
          onPressOverride={openPrivacyPolicy}
        />

        {isAuthed && <DeleteAccountListItem />}
      </View>
    </>
  )

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps={true}>
        {header()}

        {targetsSection()}

        {statsSection()}

        {authSection()}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default AccountScreen

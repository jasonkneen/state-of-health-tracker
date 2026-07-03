import React from 'react'

import {View} from 'react-native'

import {MaterialCommunityIcons} from '@expo/vector-icons'
import {useRunsBetaStore} from '@store/runsBeta/useRunsBetaStore'
import {Theme} from '@styles/theme'

import {closeGlobalBottomSheet} from '@components/GlobalBottomSheet'
import PrimaryButton from '@components/PrimaryButton'
import Text from '@components/Text'

import styles from './index.styled'

const RunsBetaWarning = () => {
  const markSeen = useRunsBetaStore(state => state.markSeen)

  const handleUnderstood = () => {
    closeGlobalBottomSheet()
    markSeen()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="flask" size={24} color={Theme.colors.white} />
        </View>

        <Text style={styles.title}>Beta Feature</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>The Runs feature is currently in beta. Please note:</Text>

        <View style={styles.bulletPoints}>
          <View style={styles.bulletPoint}>
            <View style={styles.bullet} />

            <Text style={styles.bulletText}>
              Run data is stored on your device and synced to your account when possible.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <View style={styles.bullet} />

            <Text style={styles.bulletText}>
              Background tracking accuracy is still being tuned — spot-check your route after a run.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <View style={styles.bullet} />

            <Text style={styles.bulletText}>
              Tracked data is subject to change or removal while this feature is in beta.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>We're working on more run stats and history features for future updates.</Text>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton label="I Understand" onPress={handleUnderstood} />
      </View>
    </View>
  )
}

export default RunsBetaWarning

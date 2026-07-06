import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import {Ionicons} from '@expo/vector-icons'
import {Theme} from '@styles/theme'
import LinearGradient from 'react-native-linear-gradient'

import Text from '@components/Text'

import {AI_ESCAPE_HATCH_BOLD, AI_ESCAPE_HATCH_PREFIX} from '@constants/strings'

import styles from './index.styled'

interface Props {
  onPress: () => void
}

const AiEscapeHatchCard = ({onPress}: Props) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <LinearGradient
        colors={[Theme.colors.accentGreen, Theme.colors.teal]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.aiTile}>
        <Text style={styles.aiTileGlyph}>✦</Text>
      </LinearGradient>

      <View style={styles.textColumn}>
        <Text style={styles.prefixText}>
          {AI_ESCAPE_HATCH_PREFIX}

          <Text style={styles.boldText}>{AI_ESCAPE_HATCH_BOLD}</Text>
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={Theme.colors.textMuted} />
    </TouchableOpacity>
  )
}

export default AiEscapeHatchCard

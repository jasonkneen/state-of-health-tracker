import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import {Ionicons} from '@expo/vector-icons'
import {Theme} from '@styles/theme'

import Text from '@components/Text'

import PhotoIcon from '../PhotoIcon'
import styles from './index.styled'

// Not yet in @constants/strings — promote when the Macros strings section
// grows a PHOTO_ATTACHED_TEXT constant.
const PHOTO_ATTACHED_TEXT = 'Photo attached'

interface Props {
  onRemove: () => void
}

const PhotoChip = ({onRemove}: Props) => {
  return (
    <View style={styles.container}>
      <PhotoIcon color={Theme.colors.greenOnTint} />

      <Text style={styles.label}>{PHOTO_ATTACHED_TEXT}</Text>

      <TouchableOpacity style={styles.removeButton} hitSlop={8} onPress={onRemove}>
        <Ionicons name="close" size={18} color={Theme.colors.greenOnTint} />
      </TouchableOpacity>
    </View>
  )
}

export default PhotoChip

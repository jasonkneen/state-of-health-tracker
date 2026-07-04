import React from 'react'

import {TouchableOpacity, View} from 'react-native'

import {Ionicons} from '@expo/vector-icons'
import {useUpdateAvatarMutation} from '@queries/user/useUpdateAvatarMutation'
import {Theme} from '@styles/theme'
import {captureProfilePhoto, PhotoSource} from '@utility/PhotoCaptureUtility'

import {closeGlobalBottomSheet} from '@components/GlobalBottomSheet'
import Text from '@components/Text'
import {showToast} from '@components/toast/util/ShowToast'

import {
  PROFILE_PHOTO_CHOOSE_FROM_LIBRARY,
  PROFILE_PHOTO_SHEET_SUBTITLE,
  PROFILE_PHOTO_SHEET_TITLE,
  PROFILE_PHOTO_TAKE_PHOTO,
  PROFILE_PHOTO_UPLOAD_ERROR
} from '@constants/strings'

import styles from './index.styled'

const OPTION_ICON_SIZE = 22

const ProfilePhotoBottomSheet = () => {
  const {mutateAsync: updateAvatar} = useUpdateAvatarMutation()

  const onSourcePressed = async (source: PhotoSource) => {
    closeGlobalBottomSheet()

    const base64 = await captureProfilePhoto(source)

    if (!base64) return

    try {
      await updateAvatar(base64)
    } catch (error) {
      showToast('error', PROFILE_PHOTO_UPLOAD_ERROR)
    }
  }

  return (
    <View>
      <Text style={styles.title}>{PROFILE_PHOTO_SHEET_TITLE}</Text>

      <Text style={styles.subtitle}>{PROFILE_PHOTO_SHEET_SUBTITLE}</Text>

      <View style={styles.options}>
        <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => onSourcePressed('camera')}>
          <Ionicons name="camera-outline" size={OPTION_ICON_SIZE} color={Theme.colors.textSecondary} />

          <Text style={styles.rowLabel}>{PROFILE_PHOTO_TAKE_PHOTO}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => onSourcePressed('library')}>
          <Ionicons name="images-outline" size={OPTION_ICON_SIZE} color={Theme.colors.textSecondary} />

          <Text style={styles.rowLabel}>{PROFILE_PHOTO_CHOOSE_FROM_LIBRARY}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProfilePhotoBottomSheet

import React, {useEffect, useRef, useState} from 'react'

import {Linking, TouchableWithoutFeedback, View} from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import {getMinimumAppVersion, initRemoteConfig} from '@service/remoteConfig/initRemoteConfig'
import {Theme} from '@styles/theme'
import Constants from 'expo-constants'
import {noop} from 'lodash'

import {closeGlobalBottomSheet} from '@components/GlobalBottomSheet'
import PrimaryButton from '@components/PrimaryButton'
import Text from '@components/Text'

import {UPDATE_APP_VERSION_BUTTON, UPDATE_APP_VERSION_TEXT, UPDATE_APP_VERSION_TITLE} from '@constants/strings'
import {urls} from '@constants/urls'

import styles from './index.styled'
import {isVersionGreaterOrEqual} from '../../utility/compareVersions'

const MinimumVersionSheet = () => {
  const sheetRef = useRef<BottomSheet>(null)

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    initRemoteConfig().then(initialized => {
      if (initialized) {
        const appVersion = Constants.expoConfig?.version ?? ''
        const remoteMinimum = getMinimumAppVersion()

        if (!isVersionGreaterOrEqual(appVersion, remoteMinimum)) {
          setTimeout(() => {
            sheetRef.current?.expand()
            setIsOpen(true)
          }, 2_000)
        }
      }
    })
  }, [])

  const onUpdateButtonPress = async () => {
    const supported = await Linking.canOpenURL(urls.iosStore)

    if (supported) {
      await Linking.openURL(urls.iosStore)
    }
  }

  return (
    <>
      {isOpen && (
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={closeGlobalBottomSheet}>
            <View style={styles.backdropTouchableArea} />
          </TouchableWithoutFeedback>
        </View>
      )}

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={['30%']}
        enablePanDownToClose={false}
        enableHandlePanningGesture={false}
        handleComponent={null}
        backgroundStyle={{backgroundColor: Theme.colors.background}}
        style={styles.sheetShadow}
        onClose={noop}>
        <View style={styles.sheetContent}>
          <View>
            <Text style={styles.title}>{UPDATE_APP_VERSION_TITLE}</Text>

            <Text style={styles.desc}>{UPDATE_APP_VERSION_TEXT}</Text>
          </View>

          <PrimaryButton style={styles.button} label={UPDATE_APP_VERSION_BUTTON} onPress={onUpdateButtonPress} />
        </View>
      </BottomSheet>
    </>
  )
}

export default MinimumVersionSheet

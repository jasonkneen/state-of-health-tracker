import {useEffect, useState} from 'react'

import {Image, View} from 'react-native'

import {useNavigation} from '@react-navigation/native'
import useAuthStore from '@store/auth/useAuthStore'
import {Theme} from '@styles/theme'

import Screens from '@constants/screens'

import styles from './index.styled'
import {Navigation} from '../../navigation/types'

const RootAuthScreen = () => {
  const {push} = useNavigation<Navigation>()
  const [isRendered, setIsRendered] = useState(false)

  const {initAuth} = useAuthStore()

  useEffect(() => {
    // When a user is already signed in, initAuth flips isAuthed and the root
    // navigator swaps to Home; otherwise send them to the login screen.
    if (isRendered && !initAuth()) {
      push('Auth', {screen: Screens.LOG_IN})
    }
  }, [isRendered])

  const onLayout = () => {
    if (!isRendered) {
      setIsRendered(true)
    }
  }

  return (
    <View onLayout={onLayout} style={[styles.container, {backgroundColor: Theme.colors.background}]}>
      <Image source={require('../../assets/splash.png')} style={styles.splashImage} resizeMode="cover" />
    </View>
  )
}

export default RootAuthScreen

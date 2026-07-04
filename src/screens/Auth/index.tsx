import {useEffect, useState} from 'react'

import {Image, View} from 'react-native'

import {Navigation} from '@navigation/types'
import {useNavigation} from '@react-navigation/native'
import useAuthStore from '@store/auth/useAuthStore'

import Screens from '@constants/screens'

import styles from './index.styled'

const RootAuthScreen = () => {
  const {push} = useNavigation<Navigation>()
  const [isRendered, setIsRendered] = useState(false)

  const initAuth = useAuthStore(state => state.initAuth)

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
    <View onLayout={onLayout} style={styles.container}>
      <Image source={require('@assets/splash-icon.png')} style={styles.splashLogo} resizeMode="contain" />
    </View>
  )
}

export default RootAuthScreen

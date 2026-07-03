import React from 'react'

import {TouchableOpacity} from 'react-native'

import {Ionicons} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {Theme} from '@styles/theme'

import RootAuthScreen from '@screens/Auth'
import LogInScreen from '@screens/Login'
import RegisterScreen from '@screens/Register'

import Screens from '@constants/screens'

import {Navigation} from './types'

const Stack = createNativeStackNavigator()

const AuthStack = () => {
  const {goBack, push} = useNavigation<Navigation>()

  const onBackPressed = () => {
    goBack()
    setTimeout(() => {
      push('Auth', {screen: Screens.LOG_IN})
    }, 300)
  }

  return (
    <Stack.Navigator
      screenOptions={({route}) => ({
        headerLeft: () =>
          route.name === Screens.REGISTER && (
            <TouchableOpacity onPress={onBackPressed}>
              <Ionicons name="chevron-back" size={24} color={Theme.colors.white} />
            </TouchableOpacity>
          ),
        headerStyle: {
          backgroundColor: Theme.colors.background
        },
        headerTintColor: Theme.colors.white,
        headerShadowVisible: false
      })}>
      <Stack.Screen name={Screens.RootAuth} component={RootAuthScreen} options={{headerShown: false}} />

      <Stack.Screen name={Screens.LOG_IN} component={LogInScreen} options={{headerShown: false}} />

      <Stack.Screen name={Screens.REGISTER} component={RegisterScreen} />
    </Stack.Navigator>
  )
}

export default AuthStack

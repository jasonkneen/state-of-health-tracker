import React from 'react'

import {LogBox, StatusBar, TouchableOpacity} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'

import {Ionicons} from '@expo/vector-icons'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Toast from 'react-native-toast-message'

import MinimumVersionSheet from './src/components/MinimumVersionSheet'
import GlobalBottomSheet from './src/components/GlobalBottomSheet'
import ToastConfig from './src/components/toast/ToastConfig'
import AuthStack from './src/navigation/AuthStack'
import HomeTabs from './src/navigation/HomeTabs'
import useAuthStore from './src/store/auth/useAuthStore'
import {darkTheme, useStyleTheme} from '@theme/Theme'

const Stack = createNativeStackNavigator()

LogBox.ignoreAllLogs(true)

const App = () => {
  const {isAuthed} = useAuthStore()

  const backButton = (onPress: () => void) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Ionicons name="chevron-back" size={24} color={useStyleTheme().colors.white} />
      </TouchableOpacity>
    )
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar barStyle="light-content" />

      <NavigationContainer theme={darkTheme}>
        {!isAuthed ? (
          <Stack.Navigator
            initialRouteName={'Auth'}
            screenOptions={({navigation}) => ({
              headerLeft: () => backButton(() => navigation.goBack())
            })}>
            <Stack.Screen
              name="Auth"
              component={AuthStack}
              options={{
                title: '',
                gestureEnabled: false,
                headerShown: false,
                presentation: 'modal'
              }}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator
            initialRouteName={'Home'}
            screenOptions={({navigation}) => ({
              headerLeft: () => backButton(() => navigation.goBack())
            })}>
            <Stack.Screen
              name="Home"
              component={HomeTabs}
              options={{
                animation: 'fade',
                headerShown: false
              }}
            />
          </Stack.Navigator>
        )}

        <GlobalBottomSheet />
        <MinimumVersionSheet />

        <Toast config={ToastConfig} position="top" topOffset={50} />
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App

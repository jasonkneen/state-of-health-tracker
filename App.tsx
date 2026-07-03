import React, {useEffect} from 'react'

import {LogBox, StatusBar, TouchableOpacity} from 'react-native'

import {Ionicons} from '@expo/vector-icons'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client'
import {Theme} from '@styles/theme'
import * as SplashScreen from 'expo-splash-screen'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'

import GlobalBottomSheet from './src/components/GlobalBottomSheet'
import MinimumVersionSheet from './src/components/MinimumVersionSheet'
import ToastConfig from './src/components/toast/ToastConfig'
import AuthStack from './src/navigation/AuthStack'
import HomeTabs from './src/navigation/HomeTabs'
import {asyncStoragePersister, PERSISTED_QUERY_KEYS, queryClient} from './src/queries/queryClient'
import useAuthStore from './src/store/auth/useAuthStore'

const Stack = createNativeStackNavigator()

LogBox.ignoreAllLogs(true)

const App = () => {
  const {isAuthed} = useAuthStore()

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  const backButton = (onPress: () => void) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Ionicons name="chevron-back" size={24} color={Theme.colors.white} />
      </TouchableOpacity>
    )
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        dehydrateOptions: {
          // Only whitelisted queries are written to the device — see queryClient.ts
          shouldDehydrateQuery: query => PERSISTED_QUERY_KEYS.includes(String(query.queryKey[0]))
        }
      }}>
      <GestureHandlerRootView style={{flex: 1}}>
        <StatusBar barStyle="light-content" />

        <NavigationContainer theme={Theme}>
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
    </PersistQueryClientProvider>
  )
}

export default App

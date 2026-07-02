import React from 'react'

import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {useStyleTheme} from '@theme/Theme'

import AccountScreen from '@screens/Account/AccountScreen'
// import DebugScreen from '@screens/debug/DebugScreen'

import Screens from '@constants/Screens'
import {WORKOUTS_TITLE} from '@constants/Strings'

import WorkoutsStack from './WorkoutsStack'

const Tab = createBottomTabNavigator()

const HomeTabs = () => {
  const theme = useStyleTheme()

  const barbellIcon = (color: string) => <Ionicons name="barbell" size={24} color={color} style={{marginBottom: -3}} />

  const accountIcon = (color: string) => (
    <MaterialCommunityIcons name="account" size={24} color={color} style={{marginBottom: -3}} />
  )

  const debugIcon = (color: string) => (
    <MaterialCommunityIcons name="monitor" size={24} color={color} style={{marginBottom: -3}} />
  )

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        sceneStyle: {backgroundColor: theme.colors.background},
        tabBarIcon: ({color}) => {
          if (route.name === 'WorkoutsStack') return barbellIcon(color)
          if (route.name === Screens.ACCOUNT) return accountIcon(color)
          if (route.name === Screens.DEBUG) return debugIcon(color)
        },
        headerShown: false,
        tabBarActiveTintColor: theme.colors.white,
        tabBarInactiveTintColor: theme.colors.grey,
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: theme.colors.navBar
        }
      })}>
      <Tab.Screen name={'WorkoutsStack'} component={WorkoutsStack} options={{title: WORKOUTS_TITLE}} />

      <Tab.Screen name={Screens.ACCOUNT} component={AccountScreen} />

      {/* <Tab.Screen name={Screens.DEBUG} component={DebugScreen} /> */}
    </Tab.Navigator>
  )
}

export default HomeTabs

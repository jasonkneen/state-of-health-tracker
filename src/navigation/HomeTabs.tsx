import React from 'react'

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import FontSize from '@styles/fontSize'
import {Theme} from '@styles/theme'

import AccountScreen from '@screens/Account'
import ProgressScreen from '@screens/Progress'

import AccountIcon from '@components/icons/AccountIcon'
import BarbellIcon from '@components/icons/BarbellIcon'
import PulseIcon from '@components/icons/PulseIcon'
import RunIcon from '@components/icons/RunIcon'

import Screens from '@constants/screens'
import {WORKOUTS_TITLE} from '@constants/strings'

import RunsStack from './RunsStack'
import WorkoutsStack from './WorkoutsStack'

const Tab = createBottomTabNavigator()

const TAB_ICON_SIZE = 22

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        sceneStyle: {backgroundColor: Theme.colors.background},
        tabBarIcon: ({color}) => {
          if (route.name === 'WorkoutsStack') return <BarbellIcon color={color} size={TAB_ICON_SIZE} />
          if (route.name === Screens.PROGRESS) return <PulseIcon color={color} size={TAB_ICON_SIZE} />
          if (route.name === Screens.RUNS) return <RunIcon color={color} size={TAB_ICON_SIZE} />
          if (route.name === Screens.ACCOUNT) return <AccountIcon color={color} size={TAB_ICON_SIZE} />
        },
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.accentGreen,
        tabBarInactiveTintColor: Theme.colors.textFaint,
        tabBarLabelStyle: {
          fontSize: FontSize.TAB_LABEL,
          fontWeight: '600'
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Theme.colors.hairline,
          backgroundColor: Theme.colors.navBar
        }
      })}>
      <Tab.Screen name={'WorkoutsStack'} component={WorkoutsStack} options={{title: WORKOUTS_TITLE}} />

      <Tab.Screen name={Screens.PROGRESS} component={ProgressScreen} />

      <Tab.Screen name={Screens.RUNS} component={RunsStack} />

      <Tab.Screen name={Screens.ACCOUNT} component={AccountScreen} />
    </Tab.Navigator>
  )
}

export default HomeTabs

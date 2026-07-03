import React from 'react'

import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {Theme} from '@styles/theme'

import RunFlowScreen from '@screens/RunFlow'
import RunHistoryScreen from '@screens/Runs'
import RunSummaryScreen from '@screens/RunSummary'

import Screens from '@constants/screens'

export type RunsStackParamList = {
  [Screens.RUNS]: undefined
  [Screens.RUN_FLOW]: undefined
  [Screens.RUN_SUMMARY]: {runId: string; pending?: boolean}
}

const Stack = createNativeStackNavigator<RunsStackParamList>()

// RunFlow is presented as a fullScreenModal *within* this stack rather than
// a separate parent-level modal route — this reconciles the old branch's
// `navigation.navigate('RunFlowModal')` call: `navigation.navigate(Screens.RUN_FLOW)`
// from RunHistoryScreen reads the same way and feels modal, with no changes
// needed to HomeTabs/RootStack. gestureEnabled is off so a swipe-back can't
// silently abandon an in-progress run.
const RunsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerBackButtonDisplayMode: 'minimal',
      headerStyle: {backgroundColor: Theme.colors.background},
      headerTintColor: Theme.colors.white,
      headerShadowVisible: false
    }}>
    <Stack.Screen name={Screens.RUNS} component={RunHistoryScreen} options={{headerShown: false}} />

    <Stack.Screen
      name={Screens.RUN_FLOW}
      component={RunFlowScreen}
      options={{presentation: 'fullScreenModal', headerShown: false, gestureEnabled: false}}
    />

    <Stack.Screen name={Screens.RUN_SUMMARY} component={RunSummaryScreen} options={{headerShown: false}} />
  </Stack.Navigator>
)

export default RunsStack

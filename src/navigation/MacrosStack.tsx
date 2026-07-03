import React from 'react'

import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {Theme} from '@styles/theme'

import AddFoodScreen from '@screens/AddFood'
import CreateFoodScreen from '@screens/CreateFood'
import FoodDetailScreen from '@screens/FoodDetail'
import LogWithAIScreen from '@screens/LogWithAI'
import MacrosScreen from '@screens/Macros'
import MacrosHistoryScreen from '@screens/MacrosHistory'

import Screens from '@constants/screens'

const Stack = createNativeStackNavigator()

const MacrosStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerStyle: {backgroundColor: Theme.colors.background},
        headerTintColor: Theme.colors.white,
        headerShadowVisible: false
      }}>
      <Stack.Screen name={Screens.MACROS} component={MacrosScreen} options={{headerShown: false}} />

      <Stack.Screen name={Screens.ADD_FOOD} component={AddFoodScreen} options={{title: ''}} />

      <Stack.Screen name={Screens.FOOD_DETAIL_SCREEN} component={FoodDetailScreen} options={{title: ''}} />

      <Stack.Screen name={Screens.CREATE_FOOD} component={CreateFoodScreen} options={{title: ''}} />

      <Stack.Screen name={Screens.LOG_WITH_AI} component={LogWithAIScreen} options={{title: ''}} />

      <Stack.Screen name={Screens.MACROS_HISTORY} component={MacrosHistoryScreen} options={{title: ''}} />
    </Stack.Navigator>
  )
}

export default MacrosStack

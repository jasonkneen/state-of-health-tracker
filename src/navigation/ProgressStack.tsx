import React from 'react'

import {createNativeStackNavigator} from '@react-navigation/native-stack'

import ProgressScreen from '@screens/Progress'
import SelectExerciseScreen from '@screens/SelectExercise'

import Screens from '@constants/screens'

export type ProgressStackParamList = {
  [Screens.PROGRESS]: undefined
  [Screens.SELECT_EXERCISE]: undefined
}

const Stack = createNativeStackNavigator<ProgressStackParamList>()

const ProgressStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name={Screens.PROGRESS} component={ProgressScreen} />

    <Stack.Screen name={Screens.SELECT_EXERCISE} component={SelectExerciseScreen} options={{presentation: 'modal'}} />
  </Stack.Navigator>
)

export default ProgressStack

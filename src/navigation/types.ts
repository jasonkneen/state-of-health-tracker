import {NavigatorScreenParams} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'

export type AuthStackParamList = {
  'Log In': undefined
  Register: undefined
}

export type RootStackParamList = {
  'Add Exercise': undefined
  'Previous Daily Exercise Entries': undefined
  'Create Exercise': undefined
  'Create Template': undefined
  Home: undefined
  Auth: NavigatorScreenParams<AuthStackParamList>
}

export type Navigation = NativeStackNavigationProp<RootStackParamList>

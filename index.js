import 'react-native-get-random-values'

// Registers the background GPS TaskManager task at module top level so it
// fires even on headless/background relaunches (the app process the OS
// spins up just to deliver a location batch, without ever mounting <App/>).
// Must be imported before registerRootComponent, and must never be moved
// into a component/hook.
import './src/service/location/runLocationTask'

import {registerRootComponent} from 'expo'

import App from './App'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)

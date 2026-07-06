import {StyleSheet} from 'react-native'

import {Theme} from '@styles/theme'

// Must match the native launch screen (app.json expo-splash-screen: imageWidth 200,
// centered) so the launch → in-app splash transition is seamless.
const SPLASH_LOGO_SIZE = 200

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background
  },
  splashLogo: {
    width: SPLASH_LOGO_SIZE,
    height: SPLASH_LOGO_SIZE
  }
})

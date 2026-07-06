import {StyleSheet} from 'react-native'

import Shadow from '@styles/shadow'
import {Theme} from '@styles/theme'

const FAB_SIZE = 56

export default StyleSheet.create({
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.accentGreen,
    ...Shadow.CTA_GLOW
  }
})

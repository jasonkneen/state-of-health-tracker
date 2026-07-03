import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    borderRadius: BorderRadius.CHIP,
    backgroundColor: Theme.colors.chip,
    padding: Spacing.XX_SMALL,
    paddingRight: Spacing.X_SMALL,
    flexDirection: 'row',
    alignItems: 'center'
  }
})

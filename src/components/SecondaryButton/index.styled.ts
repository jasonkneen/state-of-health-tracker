import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  inner: {
    borderRadius: BorderRadius.BUTTON,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Spacing.X_SMALL,
    alignItems: 'center',
    flexDirection: 'row'
  },
  label: {
    fontWeight: '500',
    fontSize: FontSize.H3,
    marginLeft: Spacing.XX_SMALL,
    marginRight: Spacing.XX_SMALL
  }
})

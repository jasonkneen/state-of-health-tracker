import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  inner: {
    borderRadius: BorderRadius.PILL,
    backgroundColor: Theme.colors.greenTint,
    paddingVertical: Spacing.X_SMALL,
    paddingHorizontal: Spacing.SMALL,
    alignItems: 'center',
    flexDirection: 'row'
  },
  label: {
    fontWeight: '600',
    fontSize: FontSize.LABEL,
    color: Theme.colors.accentGreen,
    marginLeft: Spacing.XX_SMALL,
    marginRight: Spacing.XX_SMALL
  }
})

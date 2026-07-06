import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  banner: {
    marginHorizontal: Spacing.MEDIUM,
    marginBottom: Spacing.SMALL,
    paddingVertical: Spacing.X_SMALL,
    paddingHorizontal: Spacing.SMALL,
    borderRadius: 10,
    backgroundColor: Theme.colors.dangerTint
  },
  bannerText: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.fireOrange,
    textAlign: 'center'
  }
})

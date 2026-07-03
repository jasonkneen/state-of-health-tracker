import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.X_LARGE * 2,
    rowGap: Spacing.X_SMALL
  },
  title: {
    fontSize: FontSize.H2,
    fontWeight: '700'
  },
  subtitle: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textSecondary,
    textAlign: 'center'
  }
})

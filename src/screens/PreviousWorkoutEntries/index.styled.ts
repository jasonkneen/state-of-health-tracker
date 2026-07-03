import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  list: {
    flex: 1
  },
  // Mirrors the Macros history screen title
  title: {
    fontSize: FontSize.SCREEN_TITLE,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: Theme.colors.text,
    marginTop: Spacing.X_SMALL,
    marginBottom: Spacing.MEDIUM,
    marginHorizontal: Spacing.GUTTER
  },
  icon: {
    alignSelf: 'center',
    marginTop: Spacing.MEDIUM
  },
  chipIcon: {
    marginRight: Spacing.XX_SMALL
  },
  chipContainer: {
    paddingRight: Spacing.SMALL,
    paddingLeft: Spacing.SMALL,
    alignSelf: 'flex-start',
    marginRight: Spacing.X_SMALL
  },
  footerSpinner: {
    marginVertical: Spacing.MEDIUM
  }
})

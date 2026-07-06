import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  listContent: {
    paddingBottom: Spacing.LARGE
  },
  eyebrow: {
    fontSize: FontSize.CAPTION,
    fontWeight: '700',
    letterSpacing: 1,
    color: Theme.colors.accentGreen,
    marginHorizontal: Spacing.MEDIUM
  },
  title: {
    fontSize: FontSize.SCREEN_TITLE,
    fontWeight: 'bold',
    marginTop: Spacing.XX_SMALL,
    marginHorizontal: Spacing.MEDIUM
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.MEDIUM,
    marginTop: Spacing.GUTTER,
    marginBottom: Spacing.SMALL
  },
  sectionHeaderText: {
    fontSize: FontSize.H3,
    fontWeight: 'bold'
  },
  emptyText: {
    fontWeight: '200',
    paddingHorizontal: Spacing.MEDIUM,
    paddingVertical: Spacing.MEDIUM,
    textAlign: 'center',
    alignSelf: 'center'
  }
})

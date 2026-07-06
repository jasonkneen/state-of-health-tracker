import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const DOT_SIZE = 8

export default StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: FontSize.H1
  },
  subtitle: {
    fontWeight: '200',
    marginTop: Spacing.XX_SMALL,
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textSecondary
  },
  sections: {
    marginTop: Spacing.MEDIUM,
    rowGap: Spacing.X_SMALL
  },
  sectionRow: {
    backgroundColor: Theme.colors.tile,
    borderWidth: 1,
    borderColor: Theme.colors.inputBorder,
    borderRadius: BorderRadius.ITEM,
    paddingVertical: Spacing.SMALL,
    paddingHorizontal: Spacing.MEDIUM
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.XX_SMALL
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: BorderRadius.PILL
  },
  dotLifts: {
    backgroundColor: Theme.colors.accentGreen
  },
  dotSteps: {
    backgroundColor: Theme.colors.teal
  },
  dotRuns: {
    backgroundColor: Theme.colors.lime
  },
  sectionTitle: {
    fontSize: FontSize.BODY,
    fontWeight: '600'
  },
  sectionBody: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textSecondary,
    marginTop: Spacing.XX_SMALL
  },
  disclaimer: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted,
    marginTop: Spacing.MEDIUM
  }
})

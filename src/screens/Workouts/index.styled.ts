import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  root: {
    flex: 1
  },
  dateOverline: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    color: Theme.colors.accentGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: Spacing.MEDIUM,
    marginLeft: Spacing.GUTTER
  },
  workoutTitle: {
    fontSize: FontSize.SCREEN_TITLE,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: Spacing.XX_SMALL,
    marginLeft: Spacing.GUTTER
  },
  emptyIcon: {
    alignSelf: 'center',
    marginRight: -Spacing.MEDIUM,
    marginTop: Spacing.MEDIUM
  },
  addExerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: Spacing.X_SMALL,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Theme.colors.dashedBorder,
    borderRadius: BorderRadius.ITEM,
    paddingVertical: Spacing.SMALL,
    marginHorizontal: Spacing.GUTTER,
    marginTop: Spacing.XX_SMALL
  },
  addExerciseText: {
    fontSize: FontSize.PARAGRAPH,
    fontWeight: '600',
    color: Theme.colors.textSecondary
  },
  footerButton: {
    marginTop: Spacing.MEDIUM,
    marginBottom: Spacing.LARGE,
    marginHorizontal: Spacing.GUTTER
  },
  sectionList: {
    width: '100%',
    height: '100%'
  },
  loadingIndicator: {
    height: 250,
    position: 'relative',
    backgroundColor: 'transparent'
  }
})

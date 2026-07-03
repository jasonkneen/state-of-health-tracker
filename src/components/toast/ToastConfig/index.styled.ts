import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const ACTION_TOAST_WIDTH = '90%'
const ACTION_BORDER_WIDTH = 5

export default StyleSheet.create({
  successToast: {
    borderLeftColor: Theme.colors.success,
    backgroundColor: Theme.colors.tertiary
  },
  errorToast: {
    borderLeftColor: Theme.colors.errorLight,
    backgroundColor: Theme.colors.tertiary
  },
  contentContainer: {
    paddingHorizontal: Spacing.MEDIUM
  },
  text1: {
    color: Theme.colors.text,
    fontSize: FontSize.H3,
    fontWeight: '400'
  },
  text2: {
    color: Theme.colors.text,
    fontSize: FontSize.PARAGRAPH,
    fontWeight: '300'
  },
  actionToast: {
    width: ACTION_TOAST_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.SMALL,
    paddingHorizontal: Spacing.MEDIUM,
    borderRadius: BorderRadius.TIP,
    borderLeftWidth: ACTION_BORDER_WIDTH,
    borderLeftColor: Theme.colors.success,
    backgroundColor: Theme.colors.tertiary
  },
  actionTextColumn: {
    flex: 1,
    marginRight: Spacing.SMALL
  },
  actionButton: {
    paddingVertical: Spacing.X_SMALL,
    paddingHorizontal: Spacing.MEDIUM,
    borderRadius: BorderRadius.PILL,
    backgroundColor: Theme.colors.greenTint
  },
  actionButtonText: {
    color: Theme.colors.accentGreen,
    fontSize: FontSize.LABEL,
    fontWeight: '700'
  }
})

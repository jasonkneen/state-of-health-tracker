import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  formContainer: {
    marginTop: Spacing.MEDIUM,
    marginHorizontal: Spacing.MEDIUM
  },
  submitButton: {
    marginTop: Spacing.LARGE
  },
  appleButton: {
    marginBottom: Spacing.SMALL
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.SMALL,
    marginVertical: Spacing.MEDIUM
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Theme.colors.inputBorder
  },
  dividerText: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textSecondary
  },
  registerLink: {
    marginTop: Spacing.LARGE,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Theme.colors.secondaryLighter
  }
})

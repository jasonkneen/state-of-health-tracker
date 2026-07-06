import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  formContainer: {
    marginTop: Spacing.MEDIUM,
    marginHorizontal: Spacing.MEDIUM
  },
  description: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.textSecondary,
    marginBottom: Spacing.MEDIUM
  },
  submitButton: {
    marginTop: Spacing.LARGE
  }
})

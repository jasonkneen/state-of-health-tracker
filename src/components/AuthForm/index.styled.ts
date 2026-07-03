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
  registerLink: {
    marginTop: Spacing.LARGE,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Theme.colors.secondaryLighter
  }
})

import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

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
  }
})

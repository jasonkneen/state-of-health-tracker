import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  textInput: {
    fontSize: FontSize.H3,
    color: Theme.colors.text,
    padding: Spacing.SMALL,
    borderRadius: BorderRadius.TEXT_INPUT,
    borderWidth: 1,
    borderColor: Theme.colors.inputBorder,
    backgroundColor: Theme.colors.inset
  }
})

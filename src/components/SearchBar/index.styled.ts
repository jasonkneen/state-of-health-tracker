import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export const SEARCH_BAR_HEIGHT = 64

export default StyleSheet.create({
  container: {
    width: '100%',
    height: SEARCH_BAR_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: Spacing.MEDIUM
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.inset,
    borderWidth: 1,
    borderColor: Theme.colors.inputBorder,
    borderRadius: BorderRadius.PILL,
    paddingHorizontal: Spacing.SMALL
  },
  searchIcon: {
    marginLeft: Spacing.XX_SMALL,
    marginRight: Spacing.XX_SMALL
  },
  input: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent'
  },
  cancelButton: {
    padding: Spacing.XX_SMALL,
    marginRight: Spacing.XX_SMALL
  }
})

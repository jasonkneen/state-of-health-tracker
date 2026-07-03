import {StyleSheet} from 'react-native'

import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export const SEARCH_BAR_HEIGHT = 64

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: SEARCH_BAR_HEIGHT,
    backgroundColor: Theme.colors.secondary
  },
  inputContainer: {
    backgroundColor: Theme.colors.background,
    alignSelf: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    width: '90%'
  },
  searchIcon: {
    alignSelf: 'center',
    marginLeft: Spacing.MEDIUM
  },
  input: {
    borderRadius: 50,
    borderWidth: 0,
    flex: 1
  },
  cancelButton: {
    alignSelf: 'center',
    marginRight: Spacing.MEDIUM
  }
})

import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  modalCard: {
    ...Shadow.MODAL,
    padding: Spacing.MEDIUM,
    borderRadius: BorderRadius.MODAL,
    width: '90%',
    paddingBottom: Spacing.LARGE,
    backgroundColor: Theme.colors.primary,
    alignSelf: 'center'
  },
  closeIcon: {
    alignSelf: 'flex-end'
  },
  title: {
    alignSelf: 'center',
    fontSize: FontSize.H2,
    paddingBottom: Spacing.SMALL,
    fontWeight: 'bold'
  },
  subtitle: {
    alignSelf: 'center',
    fontSize: FontSize.PARAGRAPH,
    paddingTop: Spacing.X_SMALL,
    paddingBottom: Spacing.MEDIUM,
    fontWeight: '300'
  },
  errorMessage: {
    color: Theme.colors.error,
    alignSelf: 'flex-start',
    fontSize: FontSize.PARAGRAPH,
    fontWeight: '300',
    marginTop: Spacing.XX_SMALL
  },
  button: {
    marginTop: Spacing.MEDIUM
  }
})

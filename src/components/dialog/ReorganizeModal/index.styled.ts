import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  itemTitle: {
    textAlign: 'center',
    marginLeft: Spacing.MEDIUM,
    marginRight: Spacing.MEDIUM,
    marginTop: 2,
    marginBottom: 2,
    fontSize: FontSize.H2,
    fontWeight: 'bold',
    color: Theme.colors.white
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  modalCard: {
    ...Shadow.MODAL,
    borderRadius: BorderRadius.MODAL,
    backgroundColor: Theme.colors.primary,
    alignSelf: 'center',
    width: '90%',
    padding: Spacing.MEDIUM
  },
  body: {
    textAlign: 'center',
    marginLeft: Spacing.MEDIUM,
    marginRight: Spacing.MEDIUM,
    marginBottom: Spacing.MEDIUM,
    fontSize: FontSize.H3,
    fontWeight: '300'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.LARGE
  },
  button: {
    padding: Spacing.X_SMALL
  },
  confirmButton: {
    backgroundColor: Theme.colors.secondaryLighter,
    padding: Spacing.X_SMALL
  }
})

import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  header: {
    borderRadius: BorderRadius.SECTION,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Theme.colors.background,
    borderColor: Theme.colors.border,
    padding: Spacing.SMALL,
    marginTop: Spacing.X_SMALL,
    marginLeft: Spacing.MEDIUM,
    marginRight: Spacing.MEDIUM,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleButton: {
    flex: 1
  },
  title: {
    fontWeight: 'bold',
    fontSize: FontSize.H3,
    marginRight: Spacing.SMALL,
    backgroundColor: Theme.colors.background
  },
  button: {
    alignSelf: 'flex-end'
  },
  footer: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: BorderRadius.SECTION,
    borderBottomRightRadius: BorderRadius.SECTION,
    marginLeft: Spacing.MEDIUM,
    marginRight: Spacing.MEDIUM,
    paddingBottom: Spacing.LARGE,
    marginBottom: Spacing.X_SMALL
  }
})

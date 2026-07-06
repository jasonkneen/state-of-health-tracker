import {StyleSheet, ViewStyle} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

// Also retint the baked-in green CTA glow so destructive buttons don't sit
// on a green shadow
export const confirmButtonBackground = (color: string): ViewStyle => ({
  backgroundColor: color,
  shadowColor: color
})

export default StyleSheet.create({
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
    padding: Spacing.LARGE
  },
  title: {
    textAlign: 'center',
    fontSize: FontSize.H2,
    fontWeight: 'bold'
  },
  body: {
    marginTop: Spacing.MEDIUM,
    textAlign: 'center'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.LARGE
  },
  button: {
    padding: Spacing.X_SMALL
  }
})

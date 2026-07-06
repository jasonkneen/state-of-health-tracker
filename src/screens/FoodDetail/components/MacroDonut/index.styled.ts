import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import {Theme} from '@styles/theme'

export const DONUT_SIZE = 116

export const DONUT_STROKE_WIDTH = 10

export default StyleSheet.create({
  container: {
    width: DONUT_SIZE,
    height: DONUT_SIZE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  percentText: {
    fontSize: FontSize.H1,
    fontWeight: 'bold'
  },
  macroNameText: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.textMuted
  }
})

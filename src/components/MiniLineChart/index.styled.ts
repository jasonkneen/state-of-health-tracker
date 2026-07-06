import {StyleSheet} from 'react-native'

import {Theme} from '@styles/theme'

export const SCRUB_LINE_WIDTH = 1.5

export const SCRUB_DOT_SIZE = 10

export const LABEL_WIDTH = 80

export default StyleSheet.create({
  wrapper: {
    width: '100%'
  },
  scrubLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCRUB_LINE_WIDTH,
    borderRadius: SCRUB_LINE_WIDTH,
    backgroundColor: Theme.colors.textFaint
  },
  scrubDot: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCRUB_DOT_SIZE,
    height: SCRUB_DOT_SIZE,
    borderRadius: SCRUB_DOT_SIZE / 2,
    borderWidth: 2,
    borderColor: Theme.colors.card
  },
  pointLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: LABEL_WIDTH,
    alignItems: 'center'
  },
  pointLabelPill: {
    backgroundColor: Theme.colors.tealTint,
    borderColor: Theme.colors.teal,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1
  },
  pointLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.white
  }
})

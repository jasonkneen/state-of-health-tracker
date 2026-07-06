import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  header: {
    zIndex: -1,
    alignSelf: 'flex-start',
    fontSize: FontSize.PARAGRAPH,
    fontWeight: 'bold',
    marginTop: Spacing.SMALL,
    marginBottom: Spacing.SMALL
  },
  input: {
    width: '100%',
    zIndex: -1
  },
  error: {
    color: Theme.colors.error,
    alignSelf: 'flex-start',
    fontSize: FontSize.PARAGRAPH,
    fontWeight: '300',
    marginTop: Spacing.XX_SMALL
  }
})

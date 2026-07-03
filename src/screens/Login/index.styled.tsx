import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'

export default StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
    justifyContent: 'space-between'
  },
  text: {
    fontWeight: '200',
    alignSelf: 'center',
    fontSize: FontSize.PARAGRAPH
  },
  textContainer: {
    marginHorizontal: 20,
    gap: 20,
    marginBottom: Spacing.X_LARGE
  }
})

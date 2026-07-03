import {StyleSheet, ViewStyle} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export const itemBackground = (backgroundColor: string, leftRightMargin: number): ViewStyle => ({
  backgroundColor,
  marginLeft: leftRightMargin,
  marginRight: leftRightMargin
})

export default StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: BorderRadius.LIST_ITEM,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Spacing.X_SMALL,
    marginTop: Spacing.XX_SMALL,
    marginBottom: Spacing.XX_SMALL
  },
  textContainer: {
    flex: 1
  },
  leadingContainer: {
    justifyContent: 'center',
    marginLeft: Spacing.X_SMALL
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: Spacing.XX_SMALL
  },
  subtitle: {
    fontWeight: '200',
    marginLeft: 10
  },
  chipContainer: {
    top: 0,
    bottom: 0,
    justifyContent: 'center'
  },
  leftBorder: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: Theme.colors.background,
    paddingRight: Spacing.MEDIUM,
    borderRightWidth: 1,
    borderRightColor: Theme.colors.border
  },
  rightBorder: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 1,
    height: '100%',
    paddingRight: Spacing.MEDIUM,
    backgroundColor: Theme.colors.background,
    borderLeftWidth: 1,
    borderLeftColor: Theme.colors.border
  }
})

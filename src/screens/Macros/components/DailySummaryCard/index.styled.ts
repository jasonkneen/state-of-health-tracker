import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.LARGE,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    padding: Spacing.GUTTER
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  ringCenter: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.MEDIUM
  },
  balanceValue: {
    fontSize: FontSize.STAT_LG,
    fontWeight: '700',
    letterSpacing: -0.4
  },
  balanceLabel: {
    fontSize: FontSize.OVERLINE,
    color: Theme.colors.textSecondary,
    marginTop: Spacing.XX_SMALL / 2
  },
  balanceLabelOver: {
    color: Theme.colors.danger
  },
  macroRows: {
    flex: 1
  }
})

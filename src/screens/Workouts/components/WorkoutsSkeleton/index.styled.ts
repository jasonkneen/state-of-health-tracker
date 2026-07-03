import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  dateOverline: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    color: Theme.colors.accentGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: Spacing.MEDIUM,
    marginLeft: Spacing.GUTTER
  },
  workoutTitle: {
    fontSize: FontSize.SCREEN_TITLE,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: Spacing.XX_SMALL,
    marginLeft: Spacing.GUTTER
  },
  weekStripCard: {
    ...Shadow.CARD,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD,
    paddingVertical: Spacing.SMALL,
    paddingHorizontal: Spacing.MEDIUM,
    marginHorizontal: Spacing.GUTTER,
    marginTop: Spacing.SMALL,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  circlesRow: {
    flexDirection: 'row',
    columnGap: Spacing.XX_SMALL + 2
  },
  exerciseCard: {
    ...Shadow.CARD,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    padding: Spacing.MEDIUM,
    marginHorizontal: Spacing.GUTTER,
    marginTop: Spacing.SMALL
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.SMALL
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: Spacing.X_SMALL,
    marginTop: Spacing.X_SMALL
  }
})

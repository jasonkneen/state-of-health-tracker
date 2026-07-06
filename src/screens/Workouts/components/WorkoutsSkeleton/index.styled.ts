import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const SET_NUMBER_COLUMN_WIDTH = 34
const CHECK_COLUMN_WIDTH = 42

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
    alignItems: 'center',
    columnGap: Spacing.XX_SMALL + 2
  },
  exerciseCard: {
    ...Shadow.CARD,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    marginHorizontal: Spacing.GUTTER,
    marginTop: Spacing.SMALL,
    paddingBottom: Spacing.MEDIUM
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.MEDIUM,
    paddingBottom: Spacing.SMALL
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.X_SMALL,
    paddingHorizontal: Spacing.MEDIUM,
    paddingBottom: Spacing.XX_SMALL
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.X_SMALL,
    paddingHorizontal: Spacing.MEDIUM,
    paddingVertical: Spacing.XX_SMALL
  },
  setNumberColumn: {
    width: SET_NUMBER_COLUMN_WIDTH
  },
  cellColumn: {
    flex: 1,
    alignItems: 'center'
  },
  checkColumn: {
    width: CHECK_COLUMN_WIDTH,
    alignItems: 'center'
  }
})

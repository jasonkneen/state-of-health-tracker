import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const SET_NUMBER_COLUMN_WIDTH = 34
const CHECK_COLUMN_WIDTH = 42

export default StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.card,
    marginHorizontal: Spacing.GUTTER
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.X_SMALL,
    paddingHorizontal: Spacing.MEDIUM,
    paddingBottom: Spacing.XX_SMALL
  },
  headerLabel: {
    fontSize: FontSize.OVERLINE,
    fontWeight: '600',
    color: Theme.colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.4
  },
  headerLabelSet: {
    width: SET_NUMBER_COLUMN_WIDTH
  },
  headerLabelCell: {
    flex: 1,
    textAlign: 'center'
  },
  headerLabelSpacer: {
    width: CHECK_COLUMN_WIDTH
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.X_SMALL,
    backgroundColor: Theme.colors.card,
    paddingHorizontal: Spacing.MEDIUM,
    paddingVertical: Spacing.XX_SMALL
  },
  setNumber: {
    width: SET_NUMBER_COLUMN_WIDTH,
    fontSize: FontSize.LABEL,
    fontWeight: '600',
    color: Theme.colors.textSecondary
  },
  cellInput: {
    flex: 1,
    backgroundColor: Theme.colors.inset,
    borderWidth: 0,
    borderRadius: BorderRadius.CELL,
    paddingVertical: Spacing.X_SMALL + 2,
    padding: 0,
    textAlign: 'center',
    fontSize: FontSize.BODY,
    fontWeight: '700',
    color: Theme.colors.text
  },
  cellInputCompleted: {
    color: Theme.colors.textSecondary
  },
  cellInputError: {
    backgroundColor: Theme.colors.dangerTint,
    borderWidth: 1,
    borderColor: Theme.colors.danger
  },
  checkColumn: {
    width: CHECK_COLUMN_WIDTH,
    alignItems: 'center'
  },
  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.PILL,
    borderWidth: 1.5,
    borderColor: Theme.colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkCircleDone: {
    backgroundColor: Theme.colors.accentGreen,
    borderWidth: 0
  }
})

import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const ADD_BUTTON_SIZE = 28

export default StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD_LG,
    paddingHorizontal: Spacing.MEDIUM,
    paddingVertical: Spacing.SMALL
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: Spacing.SMALL,
    paddingVertical: Spacing.X_SMALL
  },
  nameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    columnGap: Spacing.X_SMALL
  },
  name: {
    fontSize: FontSize.CARD_TITLE,
    fontWeight: '700',
    flexShrink: 1
  },
  headerCalories: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.textMuted
  },
  addButton: {
    width: ADD_BUTTON_SIZE,
    height: ADD_BUTTON_SIZE,
    borderRadius: BorderRadius.PILL,
    backgroundColor: Theme.colors.inset,
    alignItems: 'center',
    justifyContent: 'center'
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Theme.colors.hairline
  },
  emptyCta: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Theme.colors.dashedBorder,
    borderRadius: BorderRadius.ITEM,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.SMALL,
    marginTop: Spacing.X_SMALL,
    marginBottom: Spacing.X_SMALL
  },
  emptyCtaText: {
    fontSize: FontSize.PARAGRAPH,
    fontWeight: '600',
    color: Theme.colors.textSecondary
  }
})

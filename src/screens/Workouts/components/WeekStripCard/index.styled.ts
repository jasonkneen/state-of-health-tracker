import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

export default StyleSheet.create({
  card: {
    ...Shadow.CARD,
    backgroundColor: Theme.colors.card,
    borderRadius: BorderRadius.CARD,
    paddingVertical: Spacing.SMALL,
    paddingHorizontal: Spacing.MEDIUM,
    marginHorizontal: Spacing.GUTTER,
    marginTop: Spacing.SMALL
  },
  stripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  thisWeekText: {
    fontSize: FontSize.LABEL,
    color: Theme.colors.textSecondary
  },
  progressText: {
    fontWeight: '700',
    color: Theme.colors.text
  },
  circlesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.XX_SMALL + 2
  },
  circleDone: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.PILL,
    backgroundColor: Theme.colors.accentGreen,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circleRemaining: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.PILL,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Theme.colors.dashedBorder
  },
  chevron: {
    marginLeft: Spacing.XX_SMALL
  },
  revealContainer: {
    overflow: 'hidden'
  },
  measuredContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  }
})

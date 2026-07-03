import {StyleSheet} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const SELECT_CIRCLE_SIZE = 22

export default StyleSheet.create({
  container: {
    flex: 1
  },
  emptyIcon: {
    alignSelf: 'center',
    marginTop: Spacing.LARGE
  },
  emptyText: {
    fontWeight: '200',
    fontSize: FontSize.H2,
    padding: Spacing.LARGE,
    textAlign: 'center',
    alignSelf: 'center'
  },
  headerText: {
    marginLeft: Spacing.LARGE,
    fontSize: FontSize.H2,
    marginVertical: Spacing.MEDIUM,
    fontWeight: 'bold'
  },
  listContent: {
    // Keep the last rows reachable above the floating check button
    paddingBottom: 96
  },
  selectedTray: {
    flexGrow: 0,
    height: 48
  },
  selectedTrayContent: {
    paddingHorizontal: Spacing.MEDIUM,
    columnGap: Spacing.X_SMALL,
    alignItems: 'center'
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.XX_SMALL,
    backgroundColor: Theme.colors.greenTint,
    borderRadius: BorderRadius.PILL,
    paddingVertical: Spacing.X_SMALL,
    paddingLeft: Spacing.SMALL,
    paddingRight: Spacing.X_SMALL,
    maxWidth: 220
  },
  selectedChipText: {
    fontSize: FontSize.LABEL,
    fontWeight: '600',
    color: Theme.colors.greenOnTint,
    flexShrink: 1
  },
  selectCircle: {
    width: SELECT_CIRCLE_SIZE,
    height: SELECT_CIRCLE_SIZE,
    borderRadius: SELECT_CIRCLE_SIZE / 2,
    borderWidth: 1.5,
    borderColor: Theme.colors.dashedBorder,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectCircleSelected: {
    backgroundColor: Theme.colors.accentGreen,
    borderColor: Theme.colors.accentGreen
  },
  fabContainer: {
    position: 'absolute',
    right: Spacing.GUTTER,
    bottom: Spacing.LARGE
  }
})

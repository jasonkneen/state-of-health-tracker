import {Dimensions, StyleSheet, TextStyle, ViewStyle} from 'react-native'

import BorderRadius from '@styles/borderRadius'
import Shadow from '@styles/shadow'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const margin = Spacing.MEDIUM

export const yAxisLabel = (rowItemHeight: number): TextStyle => ({
  height: rowItemHeight
})

export const barBlock = (height: number): ViewStyle => ({
  height
})

export const xAxisContainer = (graphHeight: number, leftMarginMultiplier: number): ViewStyle => ({
  height: graphHeight + Spacing.LARGE,
  marginLeft: Spacing.MEDIUM * leftMarginMultiplier
})

export default StyleSheet.create({
  container: {
    ...Shadow.CARD,
    marginLeft: margin,
    marginRight: margin,
    width: Dimensions.get('window').width - margin * 2,
    backgroundColor: Theme.colors.tertiary,
    borderRadius: BorderRadius.SECTION,
    borderColor: Theme.colors.secondary,
    borderWidth: 1,
    marginBottom: Spacing.SMALL
  },
  title: {
    marginLeft: Spacing.SMALL,
    marginTop: Spacing.SMALL,
    marginBottom: Spacing.SMALL,
    fontWeight: 'bold'
  },
  labelsButton: {
    position: 'absolute',
    right: 0
  },
  label1: {
    alignSelf: 'flex-end',
    marginRight: Spacing.SMALL,
    marginTop: Spacing.SMALL,
    fontWeight: '300'
  },
  label2: {
    alignSelf: 'flex-end',
    marginRight: Spacing.SMALL,
    marginTop: Spacing.XX_SMALL,
    fontWeight: '300'
  },
  yAxis: {
    position: 'absolute',
    marginLeft: Spacing.MEDIUM,
    alignSelf: 'flex-start',
    marginTop: Spacing.MEDIUM,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  yAxisLabelText: {
    textAlign: 'right',
    fontWeight: '200'
  },
  barBlockBase: {
    marginBottom: Spacing.XX_SMALL,
    width: 25,
    alignSelf: 'center',
    borderRadius: 5
  },
  xAxisBarContainer: {
    marginTop: 'auto'
  },
  xAxisLabelText: {
    alignSelf: 'baseline',
    fontWeight: 'bold'
  },
  xAxisRow: {
    marginTop: Spacing.MEDIUM,
    marginRight: Spacing.LARGE,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  graph: {
    height: 200
  }
})

import {StyleSheet} from 'react-native'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'
import {Theme} from '@styles/theme'

const CIRCLE_BUTTON_SIZE = 44

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.LARGE,
    paddingHorizontal: Spacing.MEDIUM,
    position: 'relative'
  },
  headerTitle: {
    fontSize: FontSize.H1,
    fontWeight: '700',
    textAlign: 'center'
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.MEDIUM
  },
  controlsContainer: {
    paddingHorizontal: Spacing.MEDIUM,
    paddingTop: Spacing.LARGE
  },
  topLeftSecondButton: {
    position: 'absolute',
    top: Spacing.MEDIUM,
    left: Spacing.MEDIUM,
    width: CIRCLE_BUTTON_SIZE,
    height: CIRCLE_BUTTON_SIZE,
    borderRadius: CIRCLE_BUTTON_SIZE / 2,
    backgroundColor: Theme.colors.tile,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topLeftButton: {
    position: 'absolute',
    top: Spacing.MEDIUM,
    left: Spacing.MEDIUM + CIRCLE_BUTTON_SIZE + Spacing.SMALL,
    width: CIRCLE_BUTTON_SIZE,
    height: CIRCLE_BUTTON_SIZE,
    borderRadius: CIRCLE_BUTTON_SIZE / 2,
    backgroundColor: Theme.colors.tile,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topRightButton: {
    position: 'absolute',
    top: Spacing.MEDIUM,
    right: Spacing.MEDIUM,
    width: CIRCLE_BUTTON_SIZE,
    height: CIRCLE_BUTTON_SIZE,
    borderRadius: CIRCLE_BUTTON_SIZE / 2,
    backgroundColor: Theme.colors.tile,
    justifyContent: 'center',
    alignItems: 'center'
  },
  degradedBanner: {
    marginHorizontal: Spacing.MEDIUM,
    marginBottom: Spacing.SMALL,
    paddingVertical: Spacing.X_SMALL,
    paddingHorizontal: Spacing.SMALL,
    borderRadius: 10,
    backgroundColor: Theme.colors.dangerTint
  },
  degradedBannerText: {
    fontSize: FontSize.CAPTION,
    color: Theme.colors.fireOrange,
    textAlign: 'center'
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  countdownValue: {
    fontSize: 120,
    fontWeight: '700',
    color: Theme.colors.white,
    textAlign: 'center'
  },
  countdownSubtext: {
    fontSize: FontSize.PARAGRAPH,
    color: Theme.colors.white,
    marginTop: Spacing.MEDIUM,
    textAlign: 'center'
  }
})

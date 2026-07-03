import {DefaultTheme} from '@react-navigation/native'

const primary = '#1B1D2C'
const primarySelected = '#27293d'

const accent = '#f1505b'
const tertiary = '#2E303E'
const secondary = '#2F3955'
const secondaryLighter = '#5B8DE6'
const white = '#fff'
const grey = 'grey'

export const Theme = {
  dark: true,
  fonts: DefaultTheme.fonts,
  colors: {
    ...DefaultTheme.colors,
    background: primary,
    accentColor: accent,
    primary,
    primarySelected,
    tertiary,
    secondary,
    secondaryLighter,
    white,
    grey,
    text: white,
    navBar: '#10111a',
    chip: secondary,
    border: secondary,
    fireOrange: '#FF9502',
    error: '#da2839',
    errorLight: '#fc7784',
    success: '#34b471'
  }
}

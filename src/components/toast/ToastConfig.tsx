import React from 'react'

import {useStyleTheme} from '@styles/theme'
import {BaseToast, ToastProps} from 'react-native-toast-message'

import FontSize from '@styles/fontSize'
import Spacing from '@styles/spacing'

export default {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: useStyleTheme().colors.success, backgroundColor: useStyleTheme().colors.tertiary}}
      contentContainerStyle={{paddingHorizontal: Spacing.MEDIUM}}
      text1Style={{
        color: useStyleTheme().colors.text,
        fontSize: FontSize.H3,
        fontWeight: '400'
      }}
      text2Style={{
        color: useStyleTheme().colors.text,
        fontSize: FontSize.PARAGRAPH,
        fontWeight: '300'
      }}
    />
  ),
  error: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: useStyleTheme().colors.errorLight, backgroundColor: useStyleTheme().colors.tertiary}}
      contentContainerStyle={{paddingHorizontal: Spacing.MEDIUM}}
      text1NumberOfLines={3}
      text1Style={{
        color: useStyleTheme().colors.text,
        fontSize: FontSize.H3,
        fontWeight: '400'
      }}
      text2Style={{
        color: useStyleTheme().colors.text,
        fontSize: FontSize.PARAGRAPH,
        fontWeight: '300'
      }}
    />
  )
}

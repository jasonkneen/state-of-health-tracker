import React from 'react'

import {BaseToast, ToastProps} from 'react-native-toast-message'

import styles from './index.styled'

export default {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  error: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={styles.contentContainer}
      text1NumberOfLines={3}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  )
}

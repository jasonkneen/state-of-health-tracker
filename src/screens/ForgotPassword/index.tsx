import React, {useState} from 'react'

import {Alert, View} from 'react-native'

import {isAuthError} from '@data/models/AuthError'
import {ForgotPasswordRouteProp, Navigation} from '@navigation/types'
import {useNavigation, useRoute} from '@react-navigation/native'
import authService from '@service/auth/AuthService'
import Spacing from '@styles/spacing'
import {isValidEmail} from '@utility/AccountUtility'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import PrimaryButton from '@components/PrimaryButton'
import Text from '@components/Text'
import TextInputWithHeader from '@components/TextInputWithHeader'
import {showToast} from '@components/toast/util/ShowToast'

import Screens from '@constants/screens'
import {
  AUTH_FORM_EMAIL_ERROR,
  AUTH_FORM_EMAIL_HEADER,
  AUTH_GENERIC_ERROR_MESSAGE,
  AUTH_GENERIC_ERROR_TITLE,
  FORGOT_PASSWORD_BUTTON_TEXT,
  FORGOT_PASSWORD_DESCRIPTION,
  FORGOT_PASSWORD_SUCCESS_MESSAGE,
  FORGOT_PASSWORD_SUCCESS_TITLE,
  OKAY_BUTTON_TEXT
} from '@constants/strings'

import styles from './index.styled'

const ForgotPasswordScreen = () => {
  const {goBack, push} = useNavigation<Navigation>()
  const {params} = useRoute<ForgotPasswordRouteProp>()

  const [email, setEmail] = useState(params?.email ?? '')
  const [showEmailError, setShowEmailError] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)

  const onEmailTextChanged = (text: string) => {
    setShowEmailError(false)
    setEmail(text)
  }

  const handleSendResetLink = async () => {
    if (!isValidEmail(email)) {
      setShowEmailError(true)

      return
    }

    setIsSendingReset(true)
    try {
      await authService.sendPasswordResetEmail(email)

      showToast('success', FORGOT_PASSWORD_SUCCESS_TITLE, FORGOT_PASSWORD_SUCCESS_MESSAGE)
      goBack()
      setTimeout(() => {
        push('Auth', {screen: Screens.LOG_IN})
      }, 300)
    } catch (error) {
      const title = isAuthError(error) ? error.errorPath : AUTH_GENERIC_ERROR_TITLE
      const message = isAuthError(error) ? error.errorMessage : AUTH_GENERIC_ERROR_MESSAGE

      Alert.alert(title, message, [{text: OKAY_BUTTON_TEXT}])
    } finally {
      setIsSendingReset(false)
    }
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      extraHeight={Spacing.X_LARGE}
      keyboardDismissMode="interactive">
      <View style={styles.formContainer}>
        <Text style={styles.description}>{FORGOT_PASSWORD_DESCRIPTION}</Text>

        <TextInputWithHeader
          maxLength={64}
          header={AUTH_FORM_EMAIL_HEADER}
          keyboardType="email-address"
          value={email}
          onChangeText={onEmailTextChanged}
          errorMessage={AUTH_FORM_EMAIL_ERROR}
          showError={showEmailError}
        />

        <PrimaryButton
          style={styles.submitButton}
          isLoading={isSendingReset}
          label={FORGOT_PASSWORD_BUTTON_TEXT}
          onPress={handleSendResetLink}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

export default ForgotPasswordScreen

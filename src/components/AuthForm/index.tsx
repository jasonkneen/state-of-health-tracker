import React, {useState} from 'react'

import {Alert, Platform, TouchableOpacity, View} from 'react-native'

import {isAuthError} from '@data/models/AuthError'
import {Navigation} from '@navigation/types'
import {useNavigation} from '@react-navigation/native'
import useAuthStore from '@store/auth/useAuthStore'
import Spacing from '@styles/spacing'
import {isValidEmail, isValidPassword} from '@utility/AccountUtility'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import AppleSignInButton from '@components/AppleSignInButton'
import GoogleSignInButton from '@components/GoogleSignInButton'
import PasswordTextInput from '@components/PasswordTextInput'
import PrimaryButton from '@components/PrimaryButton'
import Text from '@components/Text'
import TextInputWithHeader from '@components/TextInputWithHeader'

import Screens from '@constants/screens'
import {
  AUTH_DIVIDER_OR,
  AUTH_FORM_CONFIRM_PASSWORD_HEADER,
  AUTH_FORM_EMAIL_ERROR,
  AUTH_FORM_EMAIL_HEADER,
  AUTH_FORM_PASSWORD_CONFIRM_ERROR,
  AUTH_FORM_PASSWORD_ERROR,
  AUTH_FORM_PASSWORD_HEADER,
  AUTH_GENERIC_ERROR_MESSAGE,
  AUTH_GENERIC_ERROR_TITLE,
  AUTH_LOG_IN_BUTTON_TEXT,
  AUTH_NO_ACCOUNT_BUTTON_TEXT,
  AUTH_REGISTER_BUTTON_TEXT,
  OKAY_BUTTON_TEXT
} from '@constants/strings'

import styles from './index.styled'

interface Props {
  readonly authType: 'register' | 'log-in'
}

const AuthForm = (props: Props) => {
  const {authType} = props

  const {goBack, push} = useNavigation<Navigation>()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showEmailError, setShowEmailError] = useState(false)
  const [showPasswordError, setShowPasswordError] = useState(false)
  const [showConfirmPasswordError, setShowConfirmPasswordError] = useState(false)

  const isAttemptingAuth = useAuthStore(state => state.isAttemptingAuth)
  const loginUser = useAuthStore(state => state.loginUser)
  const registerUser = useAuthStore(state => state.registerUser)
  const signInWithGoogle = useAuthStore(state => state.signInWithGoogle)
  const signInWithApple = useAuthStore(state => state.signInWithApple)

  const validate = (): boolean => {
    let isValid = true

    if (!isValidEmail(email)) {
      setShowEmailError(true)
      isValid = false
    }

    if (!isValidPassword(password)) {
      setShowPasswordError(true)

      return false
    }

    if (authType === 'register' && password !== confirmPassword) {
      setShowConfirmPasswordError(true)

      return false
    }

    return isValid
  }

  const onEmailTextChanged = (text: string) => {
    setShowEmailError(false)
    setEmail(text)
  }

  const onPasswordTextChanged = (text: string) => {
    setShowPasswordError(false)
    setPassword(text)
  }

  const onPasswordConfirmTextChanged = (text: string) => {
    setShowConfirmPasswordError(false)
    setConfirmPassword(text)
  }

  const handleAuth = async () => {
    if (!validate()) {
      return
    }

    try {
      if (authType === 'register') {
        await registerUser(email, password)
      } else {
        await loginUser(email, password)
      }
    } catch (error) {
      const title = isAuthError(error) ? error.errorPath : AUTH_GENERIC_ERROR_TITLE
      const message = isAuthError(error) ? error.errorMessage : AUTH_GENERIC_ERROR_MESSAGE

      Alert.alert(title, message, [{text: OKAY_BUTTON_TEXT}])
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      const title = isAuthError(error) ? error.errorPath : AUTH_GENERIC_ERROR_TITLE
      const message = isAuthError(error) ? error.errorMessage : AUTH_GENERIC_ERROR_MESSAGE

      Alert.alert(title, message, [{text: OKAY_BUTTON_TEXT}])
    }
  }

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple()
    } catch (error) {
      const title = isAuthError(error) ? error.errorPath : AUTH_GENERIC_ERROR_TITLE
      const message = isAuthError(error) ? error.errorMessage : AUTH_GENERIC_ERROR_MESSAGE

      Alert.alert(title, message, [{text: OKAY_BUTTON_TEXT}])
    }
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      extraHeight={Spacing.X_LARGE}
      keyboardDismissMode="interactive">
      <View style={styles.formContainer}>
        <TextInputWithHeader
          maxLength={64}
          header={AUTH_FORM_EMAIL_HEADER}
          value={email}
          onChangeText={onEmailTextChanged}
          errorMessage={AUTH_FORM_EMAIL_ERROR}
          showError={showEmailError}
        />

        <PasswordTextInput
          header={AUTH_FORM_PASSWORD_HEADER}
          value={password}
          onChangeText={onPasswordTextChanged}
          errorMessage={AUTH_FORM_PASSWORD_ERROR}
          showError={showPasswordError}
          secureTextEntry={true}
        />

        {authType === 'register' && (
          <PasswordTextInput
            header={AUTH_FORM_CONFIRM_PASSWORD_HEADER}
            value={confirmPassword}
            onChangeText={onPasswordConfirmTextChanged}
            errorMessage={AUTH_FORM_PASSWORD_CONFIRM_ERROR}
            showError={showConfirmPasswordError}
            secureTextEntry={true}
          />
        )}

        <PrimaryButton
          style={styles.submitButton}
          isLoading={isAttemptingAuth}
          label={authType === 'register' ? AUTH_REGISTER_BUTTON_TEXT : AUTH_LOG_IN_BUTTON_TEXT}
          onPress={handleAuth}
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />

          <Text style={styles.dividerText}>{AUTH_DIVIDER_OR}</Text>

          <View style={styles.dividerLine} />
        </View>

        {Platform.OS === 'ios' && (
          <AppleSignInButton isLoading={isAttemptingAuth} onPress={handleAppleSignIn} style={styles.appleButton} />
        )}

        <GoogleSignInButton isLoading={isAttemptingAuth} onPress={handleGoogleSignIn} />

        {authType === 'log-in' && (
          <TouchableOpacity
            onPress={() => {
              goBack()
              setTimeout(() => {
                push('Auth', {screen: Screens.REGISTER})
              }, 300)
            }}>
            <Text style={styles.registerLink}>{AUTH_NO_ACCOUNT_BUTTON_TEXT}</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAwareScrollView>
  )
}

export default AuthForm

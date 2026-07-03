import React, {useState} from 'react'

import {Alert, Image, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, View} from 'react-native'

import {isAuthError} from '@data/models/AuthError'
import {useNavigation} from '@react-navigation/native'
import useAuthStore from '@store/auth/useAuthStore'
import {Theme} from '@styles/theme'
import LinearGradient from 'react-native-linear-gradient'

import PrimaryButton from '@components/PrimaryButton'
import Text from '@components/Text'
import TextInput from '@components/TextInput'

import Screens from '@constants/screens'
import {
  APP_NAME,
  AUTH_FORM_EMAIL_ERROR,
  AUTH_FORM_PASSWORD_ERROR,
  AUTH_GENERIC_ERROR_MESSAGE,
  AUTH_GENERIC_ERROR_TITLE,
  AUTH_LOG_IN_BUTTON_TEXT,
  LOGIN_CREATE_ACCOUNT_LINK,
  LOGIN_EMAIL_PLACEHOLDER,
  LOGIN_NEW_HERE_TEXT,
  LOGIN_PASSWORD_PLACEHOLDER,
  LOGIN_TAGLINE,
  OKAY_BUTTON_TEXT
} from '@constants/strings'

import styles from './index.styled'
import {Navigation} from '../../navigation/types'
import {isValidEmail, isValidPassword} from '../../utility/AccountUtility'

const LOGIN_GRADIENT_COLORS = [Theme.colors.loginGradientStart, Theme.colors.loginGradientEnd]

const LogInScreen = () => {
  const {goBack, push} = useNavigation<Navigation>()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showEmailError, setShowEmailError] = useState(false)
  const [showPasswordError, setShowPasswordError] = useState(false)

  const {isAttemptingAuth, loginUser} = useAuthStore()

  const validate = (): boolean => {
    const emailIsValid = isValidEmail(email)
    const passwordIsValid = isValidPassword(password)

    setShowEmailError(!emailIsValid)
    setShowPasswordError(!passwordIsValid)

    return emailIsValid && passwordIsValid
  }

  const handleLogIn = async () => {
    if (!validate()) {
      return
    }

    try {
      await loginUser(email, password)
    } catch (error) {
      const title = isAuthError(error) ? error.errorPath : AUTH_GENERIC_ERROR_TITLE
      const message = isAuthError(error) ? error.errorMessage : AUTH_GENERIC_ERROR_MESSAGE

      Alert.alert(title, message, [{text: OKAY_BUTTON_TEXT}])
    }
  }

  const onRegisterPressed = () => {
    goBack()
    setTimeout(() => {
      push('Auth', {screen: Screens.REGISTER})
    }, 300)
  }

  return (
    <LinearGradient colors={LOGIN_GRADIENT_COLORS} style={styles.gradient}>
      <SafeAreaView style={styles.keyboardAvoidingView}>
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
          <View style={styles.container}>
            <View style={styles.brandContainer}>
              <Image source={require('../../../assets/icon.png')} style={styles.appIcon} />

              <Text style={styles.appName}>{APP_NAME}</Text>

              <Text style={styles.tagline}>{LOGIN_TAGLINE}</Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                style={[styles.input, showEmailError && styles.inputError]}
                value={email}
                onChangeText={text => {
                  setShowEmailError(false)
                  setEmail(text)
                }}
                placeholder={LOGIN_EMAIL_PLACEHOLDER}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={64}
              />

              {showEmailError && <Text style={styles.errorText}>{AUTH_FORM_EMAIL_ERROR}</Text>}

              <TextInput
                style={[styles.input, showPasswordError && styles.inputError]}
                value={password}
                onChangeText={text => {
                  setShowPasswordError(false)
                  setPassword(text)
                }}
                placeholder={LOGIN_PASSWORD_PLACEHOLDER}
                secureTextEntry={true}
                autoCapitalize="none"
                maxLength={64}
              />

              {showPasswordError && <Text style={styles.errorText}>{AUTH_FORM_PASSWORD_ERROR}</Text>}

              <PrimaryButton isLoading={isAttemptingAuth} label={AUTH_LOG_IN_BUTTON_TEXT} onPress={handleLogIn} />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>{LOGIN_NEW_HERE_TEXT}</Text>

              <TouchableOpacity onPress={onRegisterPressed}>
                <Text style={styles.footerLink}>{LOGIN_CREATE_ACCOUNT_LINK}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default LogInScreen

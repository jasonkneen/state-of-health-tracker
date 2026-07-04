import {AuthError, AuthErrorPathEnum} from '@data/models/AuthError'
import User, {CreateUserPayload} from '@data/models/User'
import {createUser} from '@queries/api/auth/createUser'
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import CrashUtility from '@utility/CrashUtility'

import {decodeAuthError} from './AuthErrorEnum'

// A real Error (so instanceof / CrashUtility.recordError work) carrying the
// AuthError fields the auth screens read via isAuthError()
const createAuthError = (errorPath: AuthErrorPathEnum, errorCode: string): Error & AuthError => {
  const errorMessage = decodeAuthError(errorCode)

  return Object.assign(new Error(errorMessage), {
    errorPath,
    errorDate: Date.now(),
    errorCode,
    errorMessage
  })
}

class AuthService {
  async registerUser(email: string, password: string): Promise<User> {
    let registeredUser: CreateUserPayload = {
      userId: '',
      email: ''
    }

    try {
      const {user} = await auth().createUserWithEmailAndPassword(email, password)

      registeredUser = {
        userId: user.uid,
        email: user.email ?? ''
      }
    } catch (e) {
      const error = e as FirebaseAuthTypes.NativeFirebaseAuthError

      throw createAuthError(AuthErrorPathEnum.REGISTRATION, error.code)
    }

    try {
      await createUser(registeredUser)

      return {
        id: registeredUser.userId,
        email: registeredUser.email
      }
    } catch (error) {
      // Roll back the Firebase account so the email isn't left claimed by a
      // half-created account; the original backend error is what propagates
      await this.deleteCurrentUser().catch(rollbackError => CrashUtility.recordError(rollbackError))
      throw error
    }
  }

  async logInUser(email: string, password: string): Promise<User> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password)
      const {user} = userCredential

      return {
        id: user.uid,
        name: user.displayName,
        email: user.email ?? ''
      }
    } catch (e) {
      const error = e as FirebaseAuthTypes.NativeFirebaseAuthError

      throw createAuthError(AuthErrorPathEnum.LOGIN, error.code)
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email)
    } catch (e) {
      const error = e as FirebaseAuthTypes.NativeFirebaseAuthError

      throw createAuthError(AuthErrorPathEnum.PASSWORD_RESET, error.code)
    }
  }

  getCurrentUser() {
    return auth().currentUser
  }

  /** Subscribes to Firebase auth state (cold-start restore, remote sign-out). Returns the unsubscribe function. */
  subscribeToAuthChanges(listener: (user: FirebaseAuthTypes.User | null) => void): () => void {
    return auth().onAuthStateChanged(listener)
  }

  async logOutUser() {
    await auth().signOut()
  }

  async deleteCurrentUser() {
    const currentUser = auth().currentUser

    if (!currentUser) {
      // A silent no-op here would let the caller believe the account was
      // deleted when it wasn't
      throw createAuthError(AuthErrorPathEnum.DELETE, 'auth/no-current-user')
    }

    try {
      await currentUser.delete()
    } catch (e) {
      const error = e as FirebaseAuthTypes.NativeFirebaseAuthError

      throw createAuthError(AuthErrorPathEnum.DELETE, error.code)
    }
  }
}

const authService = new AuthService()

export default authService

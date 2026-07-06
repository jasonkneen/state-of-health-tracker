export enum AuthErrorPathEnum {
  REGISTRATION = 'Registration Failed',
  LOGIN = 'Login Failed',
  LOGOUT = 'Logout Failed',
  DELETE = 'Delete Failed',
  PASSWORD_RESET = 'Password Reset Failed'
}

export interface AuthError {
  errorPath: AuthErrorPathEnum
  errorDate: number
  errorCode: string
  errorMessage: string
}

export function isAuthError(error: unknown): error is AuthError {
  return typeof error === 'object' && error !== null && 'errorPath' in error && 'errorMessage' in error
}

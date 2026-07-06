import * as Haptics from 'expo-haptics'
import Toast from 'react-native-toast-message'
const TOAST_LENGTH = 3_000
const ACTION_TOAST_LENGTH = 7_000

export const showToast = (type: 'success' | 'error', text1: string, text2?: string) => {
  Toast.show({
    type,
    text1,
    text2,
    visibilityTime: TOAST_LENGTH
  })

  if (type === 'success') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  } else {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
  }
}

// Toast with an action button (e.g. "Save to your foods? — Add"). Stays up
// longer than a plain toast so there's time to read and decide; hides itself
// when the action is pressed.
export const showActionToast = (text1: string, text2: string, actionLabel: string, onAction: () => void) => {
  Toast.show({
    type: 'action',
    text1,
    text2,
    visibilityTime: ACTION_TOAST_LENGTH,
    props: {
      actionLabel,
      onAction: () => {
        Toast.hide()
        onAction()
      }
    }
  })

  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
}

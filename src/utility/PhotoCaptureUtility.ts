import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'

export type PhotoSource = 'camera' | 'library'

// Meal photos feed the AI estimate, which wants detail; avatars render in a
// 60pt circle, so 192px covers a 3x display.
const MEAL_MAX_DIMENSION = 1024
const PROFILE_MAX_DIMENSION = 192
const JPEG_QUALITY = 0.7

// Resize + recompress before upload so payloads are small (~200-400KB for
// meals, ~10-20KB for avatars) instead of a raw 10MB camera photo.
async function encodeForUpload(uri: string, maxDimension: number): Promise<string | null> {
  const context = ImageManipulator.ImageManipulator.manipulate(uri)

  context.resize({width: maxDimension})
  const image = await context.renderAsync()
  const result = await image.saveAsync({
    format: ImageManipulator.SaveFormat.JPEG,
    compress: JPEG_QUALITY,
    base64: true
  })

  return result.base64 ?? null
}

// Returns a base64-encoded JPEG, or null if the user cancelled or denied
// permissions. Callers surface their own messaging for the null case.
async function capturePhoto(source: PhotoSource, maxDimension: number): Promise<string | null> {
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync()

    if (!permission.granted) return null
    const result = await ImagePicker.launchCameraAsync({quality: 1})

    if (result.canceled || !result.assets[0]) return null

    return encodeForUpload(result.assets[0].uri, maxDimension)
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

  if (!permission.granted) return null
  const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ['images'], quality: 1})

  if (result.canceled || !result.assets[0]) return null

  return encodeForUpload(result.assets[0].uri, maxDimension)
}

export function captureMealPhoto(source: PhotoSource): Promise<string | null> {
  return capturePhoto(source, MEAL_MAX_DIMENSION)
}

export function captureProfilePhoto(source: PhotoSource): Promise<string | null> {
  return capturePhoto(source, PROFILE_MAX_DIMENSION)
}

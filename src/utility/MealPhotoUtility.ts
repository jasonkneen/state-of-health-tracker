import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'

export type PhotoSource = 'camera' | 'library'

const MAX_DIMENSION = 1024
const JPEG_QUALITY = 0.7

// Resize + recompress before upload so estimate payloads are ~200-400KB
// instead of a raw 10MB camera photo.
async function encodeForUpload(uri: string): Promise<string | null> {
  const context = ImageManipulator.ImageManipulator.manipulate(uri)

  context.resize({width: MAX_DIMENSION})
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
export async function captureMealPhoto(source: PhotoSource): Promise<string | null> {
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync()

    if (!permission.granted) return null
    const result = await ImagePicker.launchCameraAsync({quality: 1})

    if (result.canceled || !result.assets[0]) return null

    return encodeForUpload(result.assets[0].uri)
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

  if (!permission.granted) return null
  const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ['images'], quality: 1})

  if (result.canceled || !result.assets[0]) return null

  return encodeForUpload(result.assets[0].uri)
}

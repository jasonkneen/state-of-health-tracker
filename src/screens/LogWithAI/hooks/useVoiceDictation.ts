import {useEffect, useRef, useState} from 'react'

import {ExpoSpeechRecognitionModule, useSpeechRecognitionEvent} from 'expo-speech-recognition'

import {showToast} from '@components/toast/util/ShowToast'

import {DICTATION_ERROR_TEXT, DICTATION_PERMISSION_ERROR_TEXT, DICTATION_UNAVAILABLE_TEXT} from '@constants/strings'

export const useVoiceDictation = (text: string, onTextChange: (text: string) => void) => {
  const baseTextRef = useRef('')
  const [isDictating, setIsDictating] = useState(false)

  useSpeechRecognitionEvent('result', event => {
    const transcript = event.results[0]?.transcript.trim()

    if (!transcript) return

    const baseText = baseTextRef.current

    onTextChange(baseText ? `${baseText} ${transcript}` : transcript)
  })

  useSpeechRecognitionEvent('end', () => setIsDictating(false))

  useSpeechRecognitionEvent('error', event => {
    setIsDictating(false)

    if (event.error !== 'aborted' && event.error !== 'no-speech') {
      showToast('error', DICTATION_ERROR_TEXT)
    }
  })

  useEffect(() => () => ExpoSpeechRecognitionModule.abort(), [])

  const stopDictation = () => {
    if (isDictating) {
      ExpoSpeechRecognitionModule.stop()
    }
  }

  const startDictation = async () => {
    if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
      showToast('error', DICTATION_UNAVAILABLE_TEXT)

      return
    }

    const permissions = await ExpoSpeechRecognitionModule.requestPermissionsAsync()

    if (!permissions.granted) {
      showToast('error', DICTATION_PERMISSION_ERROR_TEXT)

      return
    }

    baseTextRef.current = text.trim()
    setIsDictating(true)
    ExpoSpeechRecognitionModule.start({
      interimResults: true,
      continuous: true,
      addsPunctuation: true
    })
  }

  const toggleDictation = () => {
    if (isDictating) {
      stopDictation()
    } else {
      startDictation()
    }
  }

  return {isDictating, toggleDictation, stopDictation}
}

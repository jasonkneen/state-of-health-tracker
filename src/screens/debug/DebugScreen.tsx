import {useEffect, useState} from 'react'

import {ScrollView} from 'react-native'

import {WorkoutDay} from '@data/models/WorkoutDay'
import offlineWorkoutStorageService from '@service/workouts/OfflineWorkoutStorageService'
import {Text} from '@theme/Theme'

import PrimaryButton from '@components/PrimaryButton'

const DebugScreen = () => {
  const [offlineWorkouts, setOfflineWorkouts] = useState<WorkoutDay[]>([])

  const refreshOfflineWorkouts = () => {
    offlineWorkoutStorageService.readAll().then(setOfflineWorkouts)
  }

  useEffect(() => {
    refreshOfflineWorkouts()
  }, [])

  return (
    <ScrollView style={{marginTop: 80}}>
      <PrimaryButton label={'Refresh offline workouts'} onPress={refreshOfflineWorkouts} />

      <Text style={{fontWeight: 'bold', marginBottom: 10}}>Offline Workouts:</Text>

      <Text style={{marginBottom: 20}}>{JSON.stringify(offlineWorkouts, null, 2)}</Text>
    </ScrollView>
  )
}

export default DebugScreen

import {useEffect, useState} from 'react'

import {WorkoutDay} from '@data/models/WorkoutDay'
import offlineWorkoutStorageService from '@service/workouts/OfflineWorkoutStorageService'
import useAuthStore from '@store/auth/useAuthStore'
import useDailyWorkoutEntryStore from '@store/dailyWorkoutEntry/useDailyWorkoutEntryStore'
import {useSessionStore} from '@store/session/useSessionStore'
import {getPreviousDayISO} from '@utility/DateUtility'

export const useWorkoutDayPager = () => {
  const userId = useAuthStore(state => state.userId)
  const todayIso = useSessionStore(state => state.sessionStartDateIso)
  const loadWorkoutDay = useDailyWorkoutEntryStore(state => state.loadWorkoutDay)

  const yesterdayIso = getPreviousDayISO(todayIso)

  const [selectedDateIso, setSelectedDateIso] = useState(todayIso)
  const [isLoadingDay, setIsLoadingDay] = useState(false)
  const [previewByDate, setPreviewByDate] = useState<Record<string, WorkoutDay | null>>({})

  // Keep a local copy of the non-focused day ready so its page renders real
  // content instead of a skeleton; re-read on every page change so edits made
  // while it was focused show up when it becomes the neighbor again
  useEffect(() => {
    const previewDateIso = selectedDateIso === todayIso ? yesterdayIso : todayIso
    let isStale = false

    offlineWorkoutStorageService.findLocalWorkoutByDate(previewDateIso).then(localDay => {
      if (!isStale) {
        setPreviewByDate(previous => ({...previous, [previewDateIso]: localDay}))
      }
    })

    return () => {
      isStale = true
    }
  }, [selectedDateIso, todayIso, yesterdayIso])

  const selectDay = async (dateIso: string): Promise<void> => {
    if (dateIso === selectedDateIso || isLoadingDay) return

    setSelectedDateIso(dateIso)
    setIsLoadingDay(true)

    try {
      await loadWorkoutDay(dateIso, userId)
    } finally {
      setIsLoadingDay(false)
    }
  }

  return {
    todayIso,
    yesterdayIso,
    selectedDateIso,
    isLoadingDay,
    previewByDate,
    selectDay
  }
}

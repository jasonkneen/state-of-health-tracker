import {getCurrentDate, getCurrentDateISO} from '@utility/DateUtility'
import {create} from 'zustand'

type SessionStore = {
  sessionStartDate: string
  sessionStartDateIso: string
}

export const useSessionStore = create<SessionStore>(() => ({
  sessionStartDate: getCurrentDate(),
  sessionStartDateIso: getCurrentDateISO()
}))

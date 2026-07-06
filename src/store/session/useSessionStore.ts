import {getCurrentDate, getCurrentDateISO} from '@utility/DateUtility'
import {create} from 'zustand'

type SessionStore = {
  sessionStartDate: string
  sessionStartDateIso: string
  refreshSessionDate: () => void
}

export const useSessionStore = create<SessionStore>(set => ({
  sessionStartDate: getCurrentDate(),
  sessionStartDateIso: getCurrentDateISO(),
  // Re-evaluates "today" — called when the app returns to the foreground so a
  // session resumed after midnight doesn't attribute entries to the old day
  refreshSessionDate: () =>
    set(state => {
      const currentDateIso = getCurrentDateISO()

      if (state.sessionStartDateIso === currentDateIso) return state

      return {
        sessionStartDate: getCurrentDate(),
        sessionStartDateIso: currentDateIso
      }
    })
}))

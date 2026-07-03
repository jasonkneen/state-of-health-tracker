import {format, isMonday, isValid, parse} from 'date-fns'

export const getCurrentDate = () => format(Date.now(), 'MMMM dd, yyyy')

export const getCurrentDateISO = () => format(new Date(), 'yyyy-MM-dd')

export const formatDate = (date: number) => format(date, 'MMMM dd, yyyy')

export const formatDateUTC = (isoDate: string) => {
  const [year, month, day] = isoDate.split('T')[0].split('-')
  // Build the date in UTC so formatting with timeZone: 'UTC' shows the same
  // calendar day regardless of the device's timezone offset
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    timeZone: 'UTC'
  })
}

export const compareIsoDateStrings = (a: string, b: string): boolean => {
  try {
    const [y1, m1, d1] = a.split('T')[0].split('-')
    const [y2, m2, d2] = b.split('T')[0].split('-')

    return y1 === y2 && m1 === m2 && d1 === d2
  } catch {
    return false
  }
}

export const getPreviousDayISO = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('T')[0].split('-').map(Number)

  return format(new Date(year, month - 1, day - 1), 'yyyy-MM-dd')
}

// UTC so that date-slicing the timestamp (server-side or client-side) always
// yields the same calendar day it was built from
export const endOfDayIsoUTC = (isoDate: string): string => `${isoDate.split('T')[0]}T23:59:59.000Z`

// Builds the date from its parts so 'yyyy-MM-dd' isn't parsed as UTC midnight,
// which would display the previous calendar day in UTC+ timezones
export const formatIsoDayMonthDay = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('T')[0].split('-').map(Number)

  return format(new Date(year, month - 1, day), 'EEEE, LLLL do')
}

export const formatDateToMonthDay = (date: string | number): string => format(new Date(date), 'M/d')

export const formatDateToMonthDayName = (date: string | number): string => format(new Date(date), 'MMM d')

export const ONE_DAY_MS = 1000 * 60 * 60 * 24

export const getLast7Mondays = () => {
  const last7Mondays = []
  let daysAgo = 0
  let mostRecentMonday = Date.now()

  while (!isMonday(mostRecentMonday)) {
    daysAgo++
    mostRecentMonday = Date.now() - ONE_DAY_MS * daysAgo
  }

  for (let i = 0; i < 7; i++) {
    last7Mondays.push(mostRecentMonday - i * (ONE_DAY_MS * 7))
  }

  return last7Mondays.reverse()
}

export const formatDayMonthDay = (date: string | number): string => {
  try {
    if (typeof date === 'number') {
      return format(date, 'EEEE, LLLL do')
    }

    // Hermes' Date constructor only parses ISO strings, so parse the
    // 'MMMM dd, yyyy' session-date format explicitly
    const parsed = parse(date, 'MMMM dd, yyyy', new Date())

    return format(isValid(parsed) ? parsed : new Date(date), 'EEEE, LLLL do')
  } catch (e) {
    return ''
  }
}

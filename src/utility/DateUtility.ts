import {format, isMonday, isValid, parse} from 'date-fns'

// returns current date as Ex: September 28, 2023
export const getCurrentDate = () => format(Date.now(), 'MMMM dd, yyyy')

export const getCurrentDateISO = () => format(new Date(), 'yyyy-MM-dd')

export const formatDate = (date: number) => format(date, 'MMMM dd, yyyy')

export const formatDateUTC = (isoDate: string) => {
  const [year, month, day] = isoDate.split('T')[0].split('-')
  const date = new Date(Number(year), Number(month) - 1, Number(day))

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

export const formatDateToMonthDay = (date: string | number): string => format(new Date(date), 'M/d')

// Ex: Sep 18
export const formatDateToMonthDayName = (date: string | number): string => format(new Date(date), 'MMM d')

export const ONE_DAY_MS = 1000 * 60 * 60 * 24 // 1000 ms * 60s * 60m * 24h

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

export const isDateOlderThanADay = (date: number) => Date.now() - date > ONE_DAY_MS

import {getTimeOfDayForHour, TIME_OF_DAY_HOURS} from '../TimeOfDayUtility'

describe('getTimeOfDayForHour', () => {
  it('buckets hours into morning, afternoon and evening', () => {
    expect(getTimeOfDayForHour(0)).toBe('morning')
    expect(getTimeOfDayForHour(11)).toBe('morning')
    expect(getTimeOfDayForHour(12)).toBe('afternoon')
    expect(getTimeOfDayForHour(16)).toBe('afternoon')
    expect(getTimeOfDayForHour(17)).toBe('evening')
    expect(getTimeOfDayForHour(23)).toBe('evening')
  })
})

describe('TIME_OF_DAY_HOURS', () => {
  it('maps each period to an hour inside that period', () => {
    expect(getTimeOfDayForHour(TIME_OF_DAY_HOURS.morning)).toBe('morning')
    expect(getTimeOfDayForHour(TIME_OF_DAY_HOURS.afternoon)).toBe('afternoon')
    expect(getTimeOfDayForHour(TIME_OF_DAY_HOURS.evening)).toBe('evening')
  })
})

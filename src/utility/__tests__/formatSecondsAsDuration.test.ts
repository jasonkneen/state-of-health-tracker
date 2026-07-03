import {formatSecondsAsDuration} from '../formatSecondsAsDuration'

describe('formatSecondsAsDuration', () => {
  it('formats zero as 0:00', () => {
    expect(formatSecondsAsDuration(0)).toBe('0:00')
  })

  it('pads seconds under ten', () => {
    expect(formatSecondsAsDuration(5)).toBe('0:05')
  })

  it('formats 90 seconds as 1:30', () => {
    expect(formatSecondsAsDuration(90)).toBe('1:30')
  })

  it('formats a whole minute', () => {
    expect(formatSecondsAsDuration(60)).toBe('1:00')
  })

  it('does not pad the minutes portion', () => {
    expect(formatSecondsAsDuration(125)).toBe('2:05')
  })

  it('keeps counting minutes past an hour', () => {
    expect(formatSecondsAsDuration(3661)).toBe('61:01')
  })
})

import {capitalizeFirstLetterOfEveryWord, isNumber} from '../TextUtility'

describe('isNumber', () => {
  it('accepts a string of digits', () => {
    expect(isNumber('123')).toBe(true)
  })

  it('accepts a single digit', () => {
    expect(isNumber('0')).toBe(true)
  })

  it('accepts leading zeros', () => {
    expect(isNumber('007')).toBe(true)
  })

  it('rejects an empty string', () => {
    expect(isNumber('')).toBe(false)
  })

  it('rejects decimals', () => {
    expect(isNumber('12.3')).toBe(false)
  })

  it('rejects negative numbers', () => {
    expect(isNumber('-5')).toBe(false)
  })

  it('rejects letters', () => {
    expect(isNumber('abc')).toBe(false)
  })

  it('rejects digits with surrounding whitespace', () => {
    expect(isNumber(' 123 ')).toBe(false)
  })
})

describe('capitalizeFirstLetterOfEveryWord', () => {
  it('capitalizes each word of a lowercase sentence', () => {
    expect(capitalizeFirstLetterOfEveryWord('hello world')).toBe('Hello World')
  })

  it('lowercases the rest of each word', () => {
    expect(capitalizeFirstLetterOfEveryWord('HELLO WORLD')).toBe('Hello World')
  })

  it('handles a single word', () => {
    expect(capitalizeFirstLetterOfEveryWord('bench')).toBe('Bench')
  })

  it('handles single-character words', () => {
    expect(capitalizeFirstLetterOfEveryWord('a b c')).toBe('A B C')
  })

  it('returns an empty string unchanged', () => {
    expect(capitalizeFirstLetterOfEveryWord('')).toBe('')
  })

  it('preserves multiple consecutive spaces', () => {
    expect(capitalizeFirstLetterOfEveryWord('hello  world')).toBe('Hello  World')
  })
})

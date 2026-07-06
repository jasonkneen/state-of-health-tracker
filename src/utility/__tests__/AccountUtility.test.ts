import {isValidEmail, isValidPassword} from '../AccountUtility'

describe('isValidEmail', () => {
  it('accepts a standard email address', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('accepts dots and plus tags in the local part', () => {
    expect(isValidEmail('first.last+tag@example.co')).toBe(true)
  })

  it('accepts subdomains', () => {
    expect(isValidEmail('user@mail.example.com')).toBe(true)
  })

  it('accepts a bracketed IP address domain', () => {
    expect(isValidEmail('user@[192.168.1.1]')).toBe(true)
  })

  it('accepts a quoted local part', () => {
    expect(isValidEmail('"john doe"@example.com')).toBe(true)
  })

  it('rejects an empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })

  it('rejects a missing @ sign', () => {
    expect(isValidEmail('userexample.com')).toBe(false)
  })

  it('rejects a missing domain', () => {
    expect(isValidEmail('user@')).toBe(false)
  })

  it('rejects a missing local part', () => {
    expect(isValidEmail('@example.com')).toBe(false)
  })

  it('rejects a domain without a TLD', () => {
    expect(isValidEmail('user@example')).toBe(false)
  })

  it('rejects a single-character TLD', () => {
    expect(isValidEmail('user@example.c')).toBe(false)
  })

  it('rejects spaces in the unquoted local part', () => {
    expect(isValidEmail('john doe@example.com')).toBe(false)
  })

  it('rejects consecutive dots in the local part', () => {
    expect(isValidEmail('user..name@example.com')).toBe(false)
  })

  it('rejects multiple @ signs', () => {
    expect(isValidEmail('user@@example.com')).toBe(false)
  })
})

describe('isValidPassword', () => {
  it('accepts a password longer than 5 characters', () => {
    expect(isValidPassword('abcdef')).toBe(true)
  })

  it('rejects a password of exactly 5 characters', () => {
    expect(isValidPassword('abcde')).toBe(false)
  })

  it('rejects an empty password', () => {
    expect(isValidPassword('')).toBe(false)
  })

  it('accepts any 6 characters, including whitespace', () => {
    expect(isValidPassword('      ')).toBe(true)
  })
})

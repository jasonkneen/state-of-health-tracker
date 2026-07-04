import {getApiErrorCode} from '../ApiErrorUtility'

describe('getApiErrorCode', () => {
  it('extracts the code from an axios-shaped error', () => {
    const error = {response: {data: {error: 'quota_exceeded'}}}

    expect(getApiErrorCode(error)).toBe('quota_exceeded')
  })

  it('returns null when the error has no response payload', () => {
    expect(getApiErrorCode(new Error('network down'))).toBeNull()
  })

  it('returns null for null and undefined', () => {
    expect(getApiErrorCode(null)).toBeNull()
    expect(getApiErrorCode(undefined)).toBeNull()
  })

  it('returns null when the error field is not a string', () => {
    const error = {response: {data: {error: 42}}}

    expect(getApiErrorCode(error)).toBeNull()
  })
})

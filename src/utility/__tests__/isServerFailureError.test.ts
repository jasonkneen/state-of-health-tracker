import {AxiosError, AxiosResponse} from 'axios'

import {isPermanentRejectionError, isServerFailureError} from '../isServerFailureError'

const makeAxiosError = (status?: number): AxiosError => {
  const response = status === undefined ? undefined : ({status} as AxiosResponse)

  return new AxiosError('Request failed', 'ERR_BAD_RESPONSE', undefined, undefined, response)
}

describe('isServerFailureError', () => {
  it('returns true for a 5xx response status', () => {
    expect(isServerFailureError(makeAxiosError(500))).toBe(true)
    expect(isServerFailureError(makeAxiosError(503))).toBe(true)
  })

  it('returns false for a 4xx response status', () => {
    expect(isServerFailureError(makeAxiosError(404))).toBe(false)
    expect(isServerFailureError(makeAxiosError(400))).toBe(false)
  })

  it('returns false for an axios error without a response (network error)', () => {
    expect(isServerFailureError(makeAxiosError())).toBe(false)
  })

  it('returns false for an axios error with a zero status', () => {
    expect(isServerFailureError(makeAxiosError(0))).toBe(false)
  })

  it('returns false for a plain Error', () => {
    expect(isServerFailureError(new Error('boom'))).toBe(false)
  })

  it('returns false for null', () => {
    expect(isServerFailureError(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isServerFailureError(undefined)).toBe(false)
  })

  it('returns false for a string', () => {
    expect(isServerFailureError('server exploded')).toBe(false)
  })

  it('returns false for an axios-shaped object that is not flagged as an axios error', () => {
    expect(isServerFailureError({response: {status: 500}})).toBe(false)
  })
})

describe('isPermanentRejectionError', () => {
  it('returns true for a 4xx response status', () => {
    expect(isPermanentRejectionError(makeAxiosError(400))).toBe(true)
    expect(isPermanentRejectionError(makeAxiosError(404))).toBe(true)
    expect(isPermanentRejectionError(makeAxiosError(422))).toBe(true)
  })

  it('returns false for a 5xx response status', () => {
    expect(isPermanentRejectionError(makeAxiosError(500))).toBe(false)
  })

  it('returns false for an axios error without a response (network error)', () => {
    expect(isPermanentRejectionError(makeAxiosError())).toBe(false)
  })

  it('returns false for a plain Error', () => {
    expect(isPermanentRejectionError(new Error('boom'))).toBe(false)
  })

  it('returns false for null and undefined', () => {
    expect(isPermanentRejectionError(null)).toBe(false)
    expect(isPermanentRejectionError(undefined)).toBe(false)
  })

  it('returns false for an axios-shaped object that is not flagged as an axios error', () => {
    expect(isPermanentRejectionError({response: {status: 404}})).toBe(false)
  })
})

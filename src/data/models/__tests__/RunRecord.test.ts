import {decodeRoutePolyline, encodeRoutePolyline, RunRecord, toRunSummary} from '../RunRecord'

const makeLatLng = (index: number) => ({latitude: 40 + index * 0.0001, longitude: -105})

describe('encodeRoutePolyline', () => {
  it('returns null for an empty route', () => {
    expect(encodeRoutePolyline([])).toBeNull()
  })

  it('round-trips a short route unchanged', () => {
    const points = [makeLatLng(0), makeLatLng(1), makeLatLng(2)]

    const decoded = decodeRoutePolyline(encodeRoutePolyline(points))

    expect(decoded).toEqual(points.map(point => ({lat: point.latitude, lng: point.longitude})))
  })

  it('downsamples long routes but always keeps the finish point', () => {
    const points = Array.from({length: 302}, (_, index) => makeLatLng(index))

    const decoded = decodeRoutePolyline(encodeRoutePolyline(points))

    expect(decoded.length).toBeLessThanOrEqual(302)
    expect(decoded[0]).toEqual({lat: points[0].latitude, lng: points[0].longitude})
    expect(decoded[decoded.length - 1]).toEqual({lat: points[301].latitude, lng: points[301].longitude})
  })
})

describe('decodeRoutePolyline', () => {
  it('returns an empty array for missing input', () => {
    expect(decodeRoutePolyline(null)).toEqual([])
    expect(decodeRoutePolyline(undefined)).toEqual([])
  })

  it('returns an empty array for unparsable input instead of throwing', () => {
    expect(decodeRoutePolyline('not-json')).toEqual([])
    expect(decodeRoutePolyline('{"lat": 1}')).toEqual([])
  })
})

describe('toRunSummary', () => {
  const record: RunRecord = {
    localId: 'local-1',
    userId: 'user-1',
    startedAt: '2026-06-01T10:00:00.000Z',
    updatedAt: 0,
    durationSeconds: 1800,
    distanceMeters: 1609.34,
    calories: 105,
    runType: 'OUTDOOR',
    source: 'GPS'
  }

  it('prefers the remote id and falls back to the local id', () => {
    expect(toRunSummary({...record, id: 'remote-1'}).id).toBe('remote-1')
    expect(toRunSummary(record).id).toBe('local-1')
  })

  it('converts meters to miles', () => {
    expect(toRunSummary(record).distanceMiles).toBeCloseTo(1, 5)
  })

  it('defaults missing calories to 0', () => {
    expect(toRunSummary({...record, calories: null}).calories).toBe(0)
  })
})

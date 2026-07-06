import * as Location from 'expo-location'

import {toMapPoints} from '../index.util'

const makePoint = (latitude: number, longitude: number): Location.LocationObject => ({
  coords: {latitude, longitude, altitude: null, accuracy: 5, altitudeAccuracy: null, heading: null, speed: null},
  timestamp: 0
})

describe('toMapPoints', () => {
  it('maps location objects down to lat/lng pairs', () => {
    expect(toMapPoints([makePoint(40, -105), makePoint(40.001, -105.002)])).toEqual([
      {latitude: 40, longitude: -105},
      {latitude: 40.001, longitude: -105.002}
    ])
  })

  it('returns an empty array for no points', () => {
    expect(toMapPoints([])).toEqual([])
  })
})

import {regionFromRoute} from '../index.util'

describe('regionFromRoute', () => {
  it('returns undefined for an empty route', () => {
    expect(regionFromRoute([])).toBeUndefined()
  })

  it('centers the region on the route bounding box', () => {
    const region = regionFromRoute([
      {latitude: 40, longitude: -105},
      {latitude: 41, longitude: -104}
    ])

    expect(region?.latitude).toBe(40.5)
    expect(region?.longitude).toBe(-104.5)
  })

  it('pads the deltas beyond the raw bounding box', () => {
    const region = regionFromRoute([
      {latitude: 40, longitude: -105},
      {latitude: 41, longitude: -104}
    ])

    expect(region?.latitudeDelta).toBeCloseTo(1.4)
    expect(region?.longitudeDelta).toBeCloseTo(1.4)
  })

  it('enforces a minimum delta for a single point so the map is not fully zoomed in', () => {
    const region = regionFromRoute([{latitude: 40, longitude: -105}])

    expect(region).toEqual({
      latitude: 40,
      longitude: -105,
      latitudeDelta: 0.008,
      longitudeDelta: 0.008
    })
  })
})

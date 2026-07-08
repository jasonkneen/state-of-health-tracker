import * as Location from 'expo-location'

import {runPointBuffer} from './runPointBuffer'

/**
 * Dev-only synthetic GPS feed for exercising the full run pipeline without
 * leaving the couch: RunSessionService swaps the OS location task for this
 * feed when enabled, and everything downstream (durable buffer, live poll,
 * filtering, stats, summary, save, sync) runs exactly as production.
 *
 * Flip to `true` to fake a run; `__DEV__` guarantees it can never ship.
 */
export const MOCK_RUN_LOCATIONS_ENABLED = __DEV__ && false

const POINT_INTERVAL_MS = 2000
// ~8:00/mi jogging pace. Keep well under runMath's 7 m/s implausible-speed
// cutoff so mock segments always survive the filter pass.
const SPEED_METERS_PER_SECOND = 3.35
// Roughly one right-angle turn per city block so the route draws a loop
// instead of a straight line off the map.
const TICKS_BETWEEN_TURNS = 20
const METERS_PER_DEGREE_LATITUDE = 111320

// Hannah Community Center, East Lansing
const START_COORDS = {latitude: 42.7325, longitude: -84.4685}

class MockRunLocationFeed {
  private timer: ReturnType<typeof setInterval> | null = null
  private latitude = START_COORDS.latitude
  private longitude = START_COORDS.longitude
  private headingDegrees = 0
  private ticks = 0

  get isRunning(): boolean {
    return this.timer !== null
  }

  start(): void {
    this.stop()
    this.latitude = START_COORDS.latitude
    this.longitude = START_COORDS.longitude
    this.headingDegrees = Math.floor(Math.random() * 4) * 90
    this.ticks = 0

    this.timer = setInterval(() => {
      this.advance()

      runPointBuffer.appendToActiveRun([this.buildPoint()]).catch(() => undefined)
    }, POINT_INTERVAL_MS)
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  private advance(): void {
    this.ticks += 1

    if (this.ticks % TICKS_BETWEEN_TURNS === 0) {
      this.headingDegrees += Math.random() < 0.5 ? 90 : -90
    }

    // Small wobble so the trace looks like GPS, not a ruler
    const heading = this.headingDegrees + (Math.random() - 0.5) * 10
    const meters = SPEED_METERS_PER_SECOND * (POINT_INTERVAL_MS / 1000)
    const radians = (heading * Math.PI) / 180

    this.latitude += (meters * Math.cos(radians)) / METERS_PER_DEGREE_LATITUDE
    this.longitude +=
      (meters * Math.sin(radians)) / (METERS_PER_DEGREE_LATITUDE * Math.cos((this.latitude * Math.PI) / 180))
  }

  private buildPoint(): Location.LocationObject {
    return {
      timestamp: Date.now(),
      coords: {
        latitude: this.latitude,
        longitude: this.longitude,
        altitude: 260,
        accuracy: 5 + Math.random() * 5,
        altitudeAccuracy: 5,
        heading: this.headingDegrees,
        speed: SPEED_METERS_PER_SECOND
      }
    }
  }
}

export const mockRunLocationFeed = new MockRunLocationFeed()

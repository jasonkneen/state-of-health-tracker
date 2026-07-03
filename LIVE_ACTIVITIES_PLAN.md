# Live Activities — Tech Plan

iOS Lock Screen / Dynamic Island Live Activities (ActivityKit) for **run in progress**
and **workout in progress**. iOS only (Android already has the foreground-service
notification for runs via `START_LOCATION_OPTIONS`).

**v1 scope is deliberately minimal:** a simple status card — "Run in progress" /
"Workout in progress" — with a self-ticking elapsed timer. No stats, no buttons.
Tapping it opens the app (default Live Activity behavior — no URL scheme needed).

---

## 1. v1 — what shows on the lock screen

**Run in progress**
- Title: "Run in progress" (or "Run paused")
- Elapsed moving time — self-ticking (`Text(timerInterval:)`-style; iOS renders the
  timer natively, zero updates from JS while it runs)
- Dynamic Island: compact = run glyph + timer; minimal = glyph. (A Dynamic Island
  layout is required by ActivityKit, so we define the barest one.)

**Workout in progress**
- Title: "Workout in progress"
- Elapsed session time, self-ticking from `WorkoutDay.startedAt`
- Same minimal Dynamic Island treatment.

The timer is essentially free: both stores are timestamp-derived (`selectElapsedMs`,
`startedAt`), so we hand the activity a start date once and it ticks itself. The only
mid-activity updates are run **pause/resume** (one update each, to freeze/offset the
timer and flip the title). If we want truly zero updates, drop the timer and show text
only — but the timer is the part that makes the lock screen glanceable, so keep it.

Platform floor: iOS 16.1 (deployment target is 16.4 ✅). Activities auto-end after 8h.
Local updates need a live process — runs have the background location task, and
workouts only update on pause-free self-tick, so both fit without push/APNs.

---

## 2. Integration approach

**`expo-widgets`** — first-party, ships with SDK 57 (what we're on). Activity UI is
written in TypeScript via `@expo/ui/swift-ui` (real SwiftUI in the extension, no Swift
files in the repo). Its config plugin generates the widget-extension target under
CNG/prebuild, same shape as the HealthKit plugin. Requires a new dev-client/EAS build;
doesn't run in Expo Go.

Fallback if the spike finds gaps: `@bacons/apple-targets` + hand-written SwiftUI.
Community libs (`expo-live-activity`, `react-native-widget-extension`) are
deprecated — skip.

---

## 3. Architecture

```
src/service/liveActivity/
  LiveActivityService.ts   // wraps expo-widgets start/update/end; no-op on Android
                           // and iOS < 16.1; holds the activity handle
widgets/                   // expo-widgets UI (TS), location per plugin config
```

Side effects live in the service layer; stores stay pure.

| Lifecycle event | Hook point | Call |
|---|---|---|
| Run start | `RunSessionService.start()` | start run activity |
| Run pause/resume | `RunSessionService.pause()/resume()` | update (freeze/offset timer) |
| Run finish/discard | `stop()` / `discard()` | end |
| App relaunch mid-run | `RunSessionService.recover()` | re-attach or re-create |
| Workout start | `startedAt` transition in `useDailyWorkoutEntryStore` (store subscription in service) | start workout activity |
| Workout finish / reset / day rollover | `markWorkoutCompleted()` / `reset()` | end |

---

## 4. Phases

**Phase 0 — Spike (½ day):** install `expo-widgets`, minimal activity with a
self-ticking timer. Validate: prebuild alongside static-frameworks Firebase; a
timer-text API exists in `@expo/ui/swift-ui`; activity survives app kill mid-run and
`recover()` re-attaches. Go/no-go vs `@bacons/apple-targets`.

**Phase 1 — Run activity:** `LiveActivityService`, run card + minimal Dynamic Island,
lifecycle wiring incl. pause/resume and `recover()`.

**Phase 2 — Workout activity:** start/end from workout store transitions, elapsed
timer card.

**Later (explicitly out of scope for now):**
- Live stats on the run card (distance/pace/cals, updated from the location task)
- Interactive pause/resume buttons (iOS 17+ App Intents)
- Deep links to specific screens (needs a URL `scheme`; default tap-to-open is enough for v1)
- Rest timer + skip button (requires building the rest timer feature first)

---

## 5. Risks / open questions

- `expo-widgets` is new — the spike gates everything.
- Confirm the self-ticking timer API exists in `@expo/ui/swift-ui`; without it, v1
  degrades to static text (still shippable, just less useful).
- New widget-extension bundle id (e.g. `com.stateofhealh.tracker.widgets`) needs EAS
  provisioning updates.
- Run pause: timer shows moving time, so resume restarts the interval offset by
  accumulated paused time (one update per pause/resume — already in the design).

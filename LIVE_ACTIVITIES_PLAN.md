# Live Activities — Tech Plan

iOS Lock Screen / Dynamic Island Live Activities (ActivityKit) for **run in progress**
and **workout in progress**. iOS only (Android has no equivalent; the run already has a
foreground-service notification there via `START_LOCATION_OPTIONS`).

---

## 1. Platform constraints (what's possible on the lock screen)

| Capability | Min iOS | Notes |
|---|---|---|
| Live Activity on Lock Screen + Dynamic Island | 16.1 | Our deployment target is 16.4 ✅ |
| Tap → deep link into app | 16.1 | Needs a URL `scheme` in `app.json` (we don't have one yet) |
| **Interactive buttons** (App Intents) | **17.0** | Pause/resume etc. directly on the lock screen |
| Self-ticking timer text (`Text(timerInterval:)`) | 16.1 | Elapsed time ticks natively — no JS updates needed per second |
| Push-driven updates (APNs) | 16.1 | Not needed for v1 (see §4) |

Hard limits: an activity auto-ends after **8 hours**; the system throttles very frequent
local updates, so stat pushes should be throttled (~15–30s or on significant change).

**Update lifeline:** local (non-push) updates only happen while our process runs.
- **Runs**: the background location task (`runLocationTask.ts`) keeps the process alive →
  we can update distance/pace from the task callback even when backgrounded. ✅
- **Workouts**: the app suspends in background, but the only live-changing value is
  elapsed time, which self-ticks natively. Set counts change only when the user is
  in the app anyway. ✅ No background work needed.

---

## 2. Lock screen content & actions

### Run in progress

Display (Lock Screen + Dynamic Island expanded):
- Elapsed (moving) time — self-ticking from `startTime` + paused offset
- Distance, current pace, calories (from `RunStats`)
- Paused state visual (timer frozen, "Paused" label)
- Dynamic Island compact: timer + distance; minimal: run glyph

Actions:
| Action | Mechanism | Decision |
|---|---|---|
| Pause / Resume | Button (iOS 17+) → `runSessionService.pause()/resume()` | ✅ v1 flagship action — safe, instant, reversible |
| Finish run | Deep link into `RunFlow` finish confirmation | ✅ deliberately *not* a one-tap button — too easy to fat-finger on a lock screen, and finishing has a save/discard flow |
| Open app | Tap anywhere → deep link to `RunFlow` | ✅ v1 (works on 16.x too — the graceful degradation story) |

### Workout in progress

Display:
- Elapsed session time — self-ticking from `WorkoutDay.startedAt`
- Sets completed / total, current (last-touched) exercise name

Actions:
| Action | Mechanism | Decision |
|---|---|---|
| Open workout | Tap → deep link to Workouts screen | ✅ v1 |
| Finish workout | Deep link to the CompleteWorkoutPanel flow | ✅ v1 (same fat-finger reasoning as runs) |
| "Complete next set" button | App Intent | ❌ skip — ambiguous (which set? reps/weight not entered) |
| **Rest timer + "skip rest" button** | Countdown + App Intent | 🔮 future — the killer workout Live Activity use case, but the app has **no rest timer feature yet**; build the feature first, the Live Activity surface comes almost free after v1 |

---

## 3. Integration approach

### Chosen: `expo-widgets` (first-party, ships with SDK 57)

- Live Activity UI written in **TypeScript** using `@expo/ui/swift-ui` components
  (renders real SwiftUI in the widget extension) — no Swift in the repo.
- Config plugin generates the widget extension target under CNG/prebuild — fits our
  gitignored `ios/` workflow, same shape as the HealthKit plugin spike.
- JS API: `Activity.start(props)`, `instance.update(props)`, `instance.end(...)`,
  `addUserInteractionListener` for button taps, Dynamic Island layout slots
  (compact/expanded/minimal), push-token support if we ever want APNs updates.
- Not available in Expo Go → requires a new dev client / EAS build (already our normal
  flow after the HealthKit change).

### Alternatives considered

- **`@bacons/apple-targets` + hand-written SwiftUI + custom Expo module** — full native
  control; the fallback if `expo-widgets` can't express something (it's a new library).
  More work, Swift source in repo.
- **Community libs** (`react-native-widget-extension`, `software-mansion-labs/expo-live-activity`) —
  deprecated/unmaintained; superseded by `expo-widgets`. Rejected.

---

## 4. Architecture

New service, mirroring the `runSessionService` singleton pattern:

```
src/service/liveActivity/
  LiveActivityService.ts        // thin wrapper over expo-widgets: start/update/end,
                                // no-ops on Android + iOS < 16.1, holds activity handle
  runLiveActivity.ts            // maps RunSessionState + RunStats -> activity props
  workoutLiveActivity.ts        // maps WorkoutDay -> activity props
widgets/                        // expo-widgets UI (TS/SwiftUI), location per its plugin config
```

Wiring — side effects live in the service layer, never in components; stores stay pure:

| Lifecycle event | Hook point | Live Activity call |
|---|---|---|
| Run start | `RunSessionService.start()` | start run activity |
| Run pause/resume | `RunSessionService.pause()/resume()` | update (freeze/restart timer) |
| Run finish/discard | `useFinishRun` → `stop()/discard()` | end |
| Run stat ticks | `runLocationTask.ts` callback (headless-safe), throttled ~15–30s | update distance/pace/cals |
| App relaunch mid-run | `RunSessionService.recover()` | re-attach or re-create activity |
| Lock screen pause/resume tap | `addUserInteractionListener` → `runSessionService.pause()/resume()` | (state change flows back to activity) |
| Workout start | `useDailyWorkoutEntryStore` first-exercise/`startedAt` transition (via orchestrator or store subscription in service) | start workout activity |
| Set completed | same subscription | update counts |
| Workout finished / day rollover / reset | `markWorkoutCompleted()` / `reset()` | end |

Elapsed time is **never pushed** — both stores are timestamp-derived
(`selectElapsedMs`, `startedAt`), so the activity gets a start date + paused offset and
the timer text ticks natively.

Deep links: add `scheme` to `app.json` (e.g. `soh`), route `soh://run` → RunFlow,
`soh://workout` → Workouts via React Navigation linking config.

---

## 5. Phases

**Phase 0 — Spike (½–1 day, like the HealthKit spike)**
Install `expo-widgets`, minimal run activity: self-ticking timer + one static stat.
Validate: prebuild alongside static-frameworks Firebase; timer text API exists in
`@expo/ui/swift-ui`; button intent fires `addUserInteractionListener` **while app is
backgrounded** (the load-bearing unknown); activity survives app kill during a run and
`recover()` can re-attach. Go/no-go on `expo-widgets` vs `@bacons/apple-targets`.

**Phase 1 — Run Live Activity, display + tap-to-open**
`LiveActivityService`, run activity UI (lock screen + Dynamic Island), lifecycle wiring
per §4, stat updates from the location task, `recover()` re-attach, URL scheme + deep
link. Ships standalone value.

**Phase 2 — Interactive pause/resume (iOS 17+)**
App Intent buttons, listener → `runSessionService`, paused-state UI, graceful
degradation on 16.x (no buttons, tap still works).

**Phase 3 — Workout Live Activity**
Start/update/end from workout store transitions, elapsed + set count UI, finish via
deep link.

**Phase 4 — Future**
Rest timer feature (in-app) → rest countdown + skip button on the Live Activity.
APNs push updates only if we ever need server-driven changes (nothing today needs it).

---

## 6. Risks / open questions

- `expo-widgets` is new (SDK 57 era) — the spike gates everything; fallback is
  `@bacons/apple-targets` + Swift.
- Verify `Text(timerInterval:)`-equivalent exists in `@expo/ui/swift-ui`; without a
  self-ticking timer the whole design degrades badly.
- Confirm interaction listener behavior when the app process is suspended (workout
  case) — if taps require a live process, workout actions stay deep-link-only.
- New widget-extension bundle id (e.g. `com.stateofhealh.tracker.widgets`) + App Group
  need EAS provisioning updates.
- Paused runs: `Text(timerInterval:)` can't natively show "moving time excluding
  pauses" while running after a pause — on resume we restart the interval offset by
  accumulated paused time (one update per pause/resume, already in the design).

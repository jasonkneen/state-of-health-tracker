import {PersonalRecord, RecordTypeEnum} from '@data/models/PersonalRecord'

import {SessionSummary} from '../../../index.util'
import {buildPrCard} from '../index.util'

const EXERCISE_ID = 'exercise-1'

const makeRecord = (overrides: Partial<PersonalRecord> = {}): PersonalRecord => ({
  id: 'record-1',
  exerciseId: EXERCISE_ID,
  recordType: RecordTypeEnum.MAX_WEIGHT,
  value: 225,
  unit: 'lbs',
  repsAtRecord: 5,
  achievedAt: '2026-06-10T09:00:00.000Z',
  ...overrides
})

const makeSession = (overrides: Partial<SessionSummary> = {}): SessionSummary => ({
  date: '2026-06-10',
  topSet: {weight: 225, reps: 5},
  setCount: 3,
  estimatedOneRepMax: 262,
  ...overrides
})

describe('buildPrCard', () => {
  it('returns the card when the max-weight record was achieved in the latest session', () => {
    const sessions = [makeSession(), makeSession({date: '2026-06-01', topSet: {weight: 200, reps: 5}})]

    expect(buildPrCard([makeRecord()], sessions, EXERCISE_ID)).toEqual({
      weight: 225,
      reps: 5,
      date: '2026-06-10',
      deltaLbs: 25
    })
  })

  it('returns null when the record was achieved in an older session', () => {
    const sessions = [makeSession({date: '2026-06-15'})]

    expect(buildPrCard([makeRecord({achievedAt: '2026-06-10T09:00:00.000Z'})], sessions, EXERCISE_ID)).toBeNull()
  })

  it('returns null when there is no max-weight record for the selected exercise', () => {
    const records = [makeRecord({exerciseId: 'other-exercise'}), makeRecord({recordType: RecordTypeEnum.MAX_REPS})]

    expect(buildPrCard(records, [makeSession()], EXERCISE_ID)).toBeNull()
  })

  it('returns null when there are no sessions', () => {
    expect(buildPrCard([makeRecord()], [], EXERCISE_ID)).toBeNull()
  })

  it('returns null when the record has no reps information', () => {
    expect(buildPrCard([makeRecord({repsAtRecord: null})], [makeSession()], EXERCISE_ID)).toBeNull()
  })

  it('returns a null delta when there is no earlier weighted session', () => {
    const sessions = [makeSession(), makeSession({date: '2026-06-01', topSet: null})]

    expect(buildPrCard([makeRecord()], sessions, EXERCISE_ID)?.deltaLbs).toBeNull()
  })

  it('returns null when no exercise is selected', () => {
    expect(buildPrCard([makeRecord()], [makeSession()], undefined)).toBeNull()
  })
})

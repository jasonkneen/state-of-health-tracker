import {RunRecord} from '@data/models/RunRecord'
import {createRun} from '@queries/api/runs/createRun'
import {updateRun} from '@queries/api/runs/updateRun'
import offlineRunStorageService from '@service/runs/OfflineRunStorageService'

import syncOfflineRuns from '../syncOfflineRuns'

jest.mock('@queries/api/runs/createRun', () => ({
  createRun: jest.fn()
}))

jest.mock('@queries/api/runs/updateRun', () => ({
  updateRun: jest.fn()
}))

jest.mock('@service/runs/OfflineRunStorageService', () => ({
  __esModule: true,
  default: {
    readAll: jest.fn(),
    save: jest.fn(),
    deleteAllSynced: jest.fn(),
    deleteByLocalId: jest.fn()
  }
}))

jest.mock('@utility/CrashUtility', () => ({
  __esModule: true,
  default: {recordError: jest.fn()}
}))

const mockCreateRun = jest.mocked(createRun)
const mockUpdateRun = jest.mocked(updateRun)
const mockStorage = jest.mocked(offlineRunStorageService)

const makeRun = (overrides: Partial<RunRecord> = {}): RunRecord => ({
  localId: 'local-1',
  userId: 'user-1',
  startedAt: '2026-06-01T10:00:00.000Z',
  updatedAt: 0,
  durationSeconds: 1800,
  distanceMeters: 3218,
  runType: 'OUTDOOR',
  source: 'GPS',
  synced: false,
  ...overrides
})

describe('syncOfflineRuns', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage.save.mockResolvedValue(undefined)
    mockStorage.deleteAllSynced.mockResolvedValue(undefined)
  })

  it('creates unsynced runs without a remote id and marks them synced', async () => {
    const run = makeRun()

    mockStorage.readAll.mockResolvedValue([run])
    mockCreateRun.mockResolvedValue({run: {...run, id: 'remote-1', synced: true}, newRecords: []})

    await syncOfflineRuns()

    expect(mockCreateRun).toHaveBeenCalledWith(run)
    expect(mockStorage.save).toHaveBeenCalledWith(
      expect.objectContaining({id: 'remote-1', synced: true, syncAttempts: 0})
    )
  })

  it('updates runs that already have a remote id', async () => {
    const run = makeRun({id: 'remote-1'})

    mockStorage.readAll.mockResolvedValue([run])
    mockUpdateRun.mockResolvedValue({run: {...run, synced: true}, newRecords: []})

    await syncOfflineRuns()

    expect(mockUpdateRun).toHaveBeenCalledWith(run)
    expect(mockCreateRun).not.toHaveBeenCalled()
  })

  it('never pushes drafts awaiting the save/discard decision', async () => {
    mockStorage.readAll.mockResolvedValue([makeRun({draft: true})])

    await syncOfflineRuns()

    expect(mockCreateRun).not.toHaveBeenCalled()
    expect(mockUpdateRun).not.toHaveBeenCalled()
  })

  it('skips already-synced runs', async () => {
    mockStorage.readAll.mockResolvedValue([makeRun({synced: true})])

    await syncOfflineRuns()

    expect(mockCreateRun).not.toHaveBeenCalled()
  })

  it('increments the attempt counter on failure and keeps the run', async () => {
    const run = makeRun({syncAttempts: 1})

    mockStorage.readAll.mockResolvedValue([run])
    mockCreateRun.mockRejectedValue(new Error('server down'))

    await syncOfflineRuns()

    expect(mockStorage.save).toHaveBeenCalledWith(expect.objectContaining({localId: 'local-1', syncAttempts: 2}))
    expect(mockStorage.deleteByLocalId).not.toHaveBeenCalled()
  })

  it('parks runs that exhausted their attempts instead of deleting them', async () => {
    mockStorage.readAll.mockResolvedValue([makeRun({syncAttempts: 3})])

    await syncOfflineRuns()

    expect(mockCreateRun).not.toHaveBeenCalled()
    expect(mockStorage.deleteByLocalId).not.toHaveBeenCalled()
    expect(mockStorage.save).not.toHaveBeenCalled()
  })

  it('sweeps synced records at the end', async () => {
    mockStorage.readAll.mockResolvedValue([])

    await syncOfflineRuns()

    expect(mockStorage.deleteAllSynced).toHaveBeenCalled()
  })
})

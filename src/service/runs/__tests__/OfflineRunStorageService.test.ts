import {RunRecord} from '@data/models/RunRecord'
import * as FileSystem from 'expo-file-system/legacy'

import offlineRunStorageService from '../OfflineRunStorageService'

jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: 'file:///docs/',
  getInfoAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  moveAsync: jest.fn(),
  deleteAsync: jest.fn()
}))

const mockFileSystem = jest.mocked(FileSystem)

const makeRun = (localId: string): RunRecord => ({
  localId,
  userId: 'user-1',
  startedAt: '2026-06-01T10:00:00.000Z',
  updatedAt: 0,
  durationSeconds: 1800,
  distanceMeters: 3218,
  runType: 'OUTDOOR',
  source: 'GPS',
  synced: false
})

// An in-memory stand-in for the two files the service writes: reads return
// the committed content, writes land in a temp slot, moveAsync commits it.
let committed: string
let temp: string

beforeEach(() => {
  jest.clearAllMocks()
  committed = '[]'
  temp = ''

  mockFileSystem.getInfoAsync.mockResolvedValue({exists: true} as never)
  mockFileSystem.readAsStringAsync.mockImplementation(async () => committed)
  mockFileSystem.writeAsStringAsync.mockImplementation(async (_path, content) => {
    temp = content
  })
  mockFileSystem.moveAsync.mockImplementation(async () => {
    committed = temp
  })
})

describe('OfflineRunStorageService', () => {
  it('persists a saved run', async () => {
    await offlineRunStorageService.save(makeRun('run-1'))

    expect(await offlineRunStorageService.readAll()).toEqual([makeRun('run-1')])
  })

  it('replaces an existing record with the same localId', async () => {
    await offlineRunStorageService.save(makeRun('run-1'))
    await offlineRunStorageService.save({...makeRun('run-1'), synced: true})

    const all = await offlineRunStorageService.readAll()

    expect(all).toHaveLength(1)
    expect(all[0].synced).toBe(true)
  })

  it('does not drop concurrent writes — both runs survive', async () => {
    // Regression check: the old boolean lock silently skipped the second
    // write when two saves raced (losing a recovered run).
    await Promise.all([
      offlineRunStorageService.save(makeRun('run-1')),
      offlineRunStorageService.save(makeRun('run-2'))
    ])

    const all = await offlineRunStorageService.readAll()

    expect(all.map(run => run.localId).sort()).toEqual(['run-1', 'run-2'])
  })

  it('keeps serving writes after one write fails', async () => {
    mockFileSystem.writeAsStringAsync.mockRejectedValueOnce(new Error('disk full'))

    await expect(offlineRunStorageService.save(makeRun('run-1'))).rejects.toThrow('disk full')
    await offlineRunStorageService.save(makeRun('run-2'))

    expect((await offlineRunStorageService.readAll()).map(run => run.localId)).toEqual(['run-2'])
  })

  it('deletes only the requested localId', async () => {
    await offlineRunStorageService.save(makeRun('run-1'))
    await offlineRunStorageService.save(makeRun('run-2'))

    await offlineRunStorageService.deleteByLocalId('run-1')

    expect((await offlineRunStorageService.readAll()).map(run => run.localId)).toEqual(['run-2'])
  })

  it('sweeps only synced records', async () => {
    await offlineRunStorageService.save(makeRun('run-1'))
    await offlineRunStorageService.save({...makeRun('run-2'), synced: true})

    await offlineRunStorageService.deleteAllSynced()

    expect((await offlineRunStorageService.readAll()).map(run => run.localId)).toEqual(['run-1'])
  })
})

import {Run} from '@data/models/Run'

import {daysAgo} from '../../utility/RunUtility'

// Placeholder data until run tracking ships — shaped like the future
// server payload so this screen only needs a query hook swapped in.
export const SAMPLE_RUNS: Run[] = [
  {
    id: 'sample-run-1',
    date: daysAgo(2),
    distanceMiles: 1.33,
    durationSeconds: 913,
    calories: 133
  },
  {
    id: 'sample-run-2',
    date: daysAgo(5),
    distanceMiles: 1.32,
    durationSeconds: 896,
    calories: 128
  },
  {
    id: 'sample-run-3',
    date: daysAgo(12),
    distanceMiles: 2.18,
    durationSeconds: 1584,
    calories: 214
  },
  {
    id: 'sample-run-4',
    date: daysAgo(13),
    distanceMiles: 0.4,
    durationSeconds: 416,
    calories: 41
  }
]

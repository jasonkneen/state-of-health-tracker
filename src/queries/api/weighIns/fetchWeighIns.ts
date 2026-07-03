import {WeighIn} from '@data/models/WeighIn'
import {httpGet} from '@service/http/httpUtil'
import CrashUtility from '@utility/CrashUtility'
import * as io from 'io-ts'

import Endpoints from '@constants/endpoints'

import {WeighInResponse} from './decoder/WeighInDecoder'

const WeighInsResponse = io.type({
  weighIns: io.array(WeighInResponse)
})

export async function fetchWeighIns(): Promise<WeighIn[]> {
  try {
    const response = await httpGet(Endpoints.WeighIns, WeighInsResponse)

    const data = response?.data

    if (!data) throw new Error('No weigh-ins found')

    return data.weighIns
  } catch (error) {
    CrashUtility.recordError(error)
    throw error
  }
}

import * as io from 'io-ts'

export const WeighInResponse = io.type({
  id: io.string,
  weight: io.number,
  loggedAt: io.string
})

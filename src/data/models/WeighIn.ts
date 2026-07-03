export interface WeighIn {
  id: string
  weight: number
  loggedAt: string
}

export interface LogWeighInPayload {
  weight: number
  loggedAt: string
}

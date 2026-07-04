// Machine-readable error codes returned by the AI endpoints
// (see handleEstimateError in the backend's nutrition.controller).
export const API_ERROR_CODES = {
  featureDisabled: 'feature_disabled',
  quotaExceeded: 'quota_exceeded'
} as const

export function getApiErrorCode(error: unknown): string | null {
  const code = (error as {response?: {data?: {error?: unknown}}} | null)?.response?.data?.error

  return typeof code === 'string' ? code : null
}

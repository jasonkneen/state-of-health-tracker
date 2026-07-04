import axios from 'axios'

/** True for a 5xx response — a transient server failure worth retrying. */
export function isServerFailureError(err: unknown): boolean {
  return axios.isAxiosError(err) && (err.response?.status ?? 0) >= 500
}

/** True for a 4xx response — a permanent rejection that retrying can never fix. */
export function isPermanentRejectionError(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false

  const status = err.response?.status ?? 0

  return status >= 400 && status < 500
}

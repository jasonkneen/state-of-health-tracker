// Free daily AI quota, computed server-side (GET /macros/ai-usage).
// `unlimited` marks whitelisted friends-and-family accounts that bypass
// the cap — the meter is hidden for them.
export interface AiUsage {
  used: number
  limit: number
  resetsAt: string
  unlimited: boolean
}

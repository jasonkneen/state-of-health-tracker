import useReviewPromptStore from '@store/reviewPrompt/useReviewPromptStore'
import * as StoreReview from 'expo-store-review'

const MOMENTS_BEFORE_PROMPT = 3
const PROMPT_COOLDOWN_DAYS = 120
const DEFAULT_PROMPT_DELAY_MS = 1500

const isCoolingDown = (lastPromptedAt: string | null): boolean => {
  if (!lastPromptedAt) return false

  const daysSince = (Date.now() - new Date(lastPromptedAt).getTime()) / (1000 * 60 * 60 * 24)

  return daysSince < PROMPT_COOLDOWN_DAYS
}

// Call after the user just got value (workout completed, AI meal logged).
// iOS ultimately decides whether the sheet appears and caps it at 3 per year;
// the gates here keep our asks tied to engaged users and spaced apart.
export const registerReviewWorthyMoment = (delayMs: number = DEFAULT_PROMPT_DELAY_MS) => {
  useReviewPromptStore.getState().incrementPositiveMoments()

  const {positiveMoments, lastPromptedAt, markPrompted} = useReviewPromptStore.getState()

  if (positiveMoments < MOMENTS_BEFORE_PROMPT || isCoolingDown(lastPromptedAt)) return

  setTimeout(async () => {
    if (await StoreReview.isAvailableAsync()) {
      markPrompted()
      await StoreReview.requestReview()
    }
  }, delayMs)
}

import {zustandAsyncStorage} from '@store/zustandAsyncStorage'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

type ReviewPromptStore = {
  positiveMoments: number
  lastPromptedAt: string | null
  incrementPositiveMoments: () => void
  markPrompted: () => void
}

const useReviewPromptStore = create<ReviewPromptStore>()(
  persist(
    set => ({
      positiveMoments: 0,
      lastPromptedAt: null,
      incrementPositiveMoments: () => set(state => ({positiveMoments: state.positiveMoments + 1})),
      markPrompted: () => set({positiveMoments: 0, lastPromptedAt: new Date().toISOString()})
    }),
    {
      name: 'review-prompt-store',
      storage: zustandAsyncStorage
    }
  )
)

export default useReviewPromptStore

import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface GlobalCountState {
  openingPositionsCount: number
  pendingOrdersCount: number
  updateOpeningPositionsCount: (count: number) => void
  updatePendingOrdersCount: (count: number) => void
}

const useGlobalCount = create<GlobalCountState>()(
  immer((set) => ({
    openingPositionsCount: 0,
    pendingOrdersCount: 0,
    updateOpeningPositionsCount: (count: number) =>
      set({
        openingPositionsCount: count,
      }),
    updatePendingOrdersCount: (count: number) => set({ pendingOrdersCount: count }),
  }))
)

export default useGlobalCount

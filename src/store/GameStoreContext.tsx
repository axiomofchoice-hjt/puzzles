import { createContext, useContext, useState, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createGameStore, type GameStore, type GameStoreApi } from './gameStore'

const GameStoreContext = createContext<GameStoreApi | null>(null)

export function GameStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createGameStore)
  return <GameStoreContext.Provider value={store}>{children}</GameStoreContext.Provider>
}

export function useGameStore<T>(selector: (state: GameStore) => T): T {
  const api = useContext(GameStoreContext)
  if (!api) throw new Error('useGameStore 必须在 GameStoreProvider 内使用')
  return useStore(api, selector)
}

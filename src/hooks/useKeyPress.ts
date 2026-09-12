import { useEffect } from 'react'
import { useGameStore } from '@/store/GameStoreContext'

export function useKeyPress(): void {
  const keyDown = useGameStore((s) => s.keyDown)
  const keyUp = useGameStore((s) => s.keyUp)
  useEffect(() => {
    const down = (e: KeyboardEvent) => keyDown(e)
    const up = (e: KeyboardEvent) => keyUp(e)
    document.addEventListener('keydown', down)
    document.addEventListener('keyup', up)
    return () => {
      document.removeEventListener('keydown', down)
      document.removeEventListener('keyup', up)
    }
  }, [keyDown, keyUp])
}

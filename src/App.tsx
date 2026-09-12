import { useEffect } from 'react'
import { BonusToast } from '@/components/BonusToast/BonusToast'
import { FooterBar } from '@/components/FooterBar/FooterBar'
import { HeaderBar } from '@/components/HeaderBar/HeaderBar'
import { PuzzleBoard } from '@/components/PuzzleBoard/PuzzleBoard'
import { SideButtons } from '@/components/SideButtons/SideButtons'
import { useElementSize } from '@/hooks/useElementSize'
import { useHashRoute } from '@/hooks/useHashRoute'
import { useKeyPress } from '@/hooks/useKeyPress'
import { useGameStore } from '@/store/GameStoreContext'
import styles from './App.module.css'

export default function App() {
  const [ref, size] = useElementSize<HTMLDivElement>()
  const path = useHashRoute()
  const loadRoute = useGameStore((s) => s.loadRoute)
  const bonusShow = useGameStore((s) => s.bonus.show)
  const bonusContent = useGameStore((s) => s.bonus.content)
  const hideBonus = useGameStore((s) => s.hideBonus)
  useKeyPress()
  useEffect(() => {
    if (path !== '') loadRoute(path)
  }, [path, loadRoute])
  useEffect(() => {
    if (!bonusShow) return
    const t = setTimeout(() => hideBonus(), 2000)
    return () => clearTimeout(t)
  }, [bonusShow, bonusContent, hideBonus])
  return (
    <div ref={ref} className={styles.root}>
      <HeaderBar />
      <PuzzleBoard width={size.width} height={size.height} />
      <FooterBar />
      <BonusToast />
      <SideButtons width={size.width} height={size.height} />
    </div>
  )
}

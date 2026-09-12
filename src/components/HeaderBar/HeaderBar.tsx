import { BarText } from '@/components/BarText/BarText'
import { CONFIG } from '@/game/Config'
import { useGameStore } from '@/store/GameStoreContext'
import styles from './HeaderBar.module.css'

export function HeaderBar() {
  const header = useGameStore((s) => s.header)
  return (
    <div className={styles.header} data-testid="header" style={{ height: CONFIG.header.getHeight() - 2 }}>
      <BarText bar={CONFIG.header} align="left">
        Blockchallenge
      </BarText>
      <BarText bar={CONFIG.header} align="center" testId="header-message">
        {header.message}
      </BarText>
      <BarText bar={CONFIG.header} align="right" testId="header-level">
        {typeof header.level === 'number' ? `第 ${header.level} 关` : ''}
      </BarText>
    </div>
  )
}

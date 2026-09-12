import { Bonus } from '@/components/icons/Bonus'
import { CONFIG } from '@/game/Config'
import { useGameStore } from '@/store/GameStoreContext'
import styles from './BonusToast.module.css'

export function BonusToast() {
  const bonus = useGameStore((s) => s.bonus)
  return (
    <div className={styles.bonus} data-testid="bonus" style={{ marginTop: CONFIG.header.getHeight(), opacity: bonus.show ? 1 : 0 }}>
      <Bonus width={40} height={40} color="grey" />
      <span className={styles.text}>{bonus.content}</span>
    </div>
  )
}

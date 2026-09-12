import { BarText } from '@/components/BarText/BarText'
import { CONFIG } from '@/game/Config'
import { useGameStore } from '@/store/GameStoreContext'
import styles from './FooterBar.module.css'

export function FooterBar() {
  const tasks = useGameStore((s) => s.tasks)
  const allOk = tasks.every((t) => t.ok())
  return (
    <div
      className={styles.footer}
      data-testid="footer"
      style={{ height: CONFIG.footer.getHeight() - 2, backgroundColor: allOk ? 'lightgreen' : 'white' }}
    >
      <BarText bar={CONFIG.footer} align="center" testId="footer-tasks">
        {tasks.map((t, i) => (
          <span key={i} className={styles.task} style={{ color: t.ok() ? '#080' : t.fail() ? 'red' : 'black' }}>
            [{t.now}/{t.max}]
          </span>
        ))}
      </BarText>
      <BarText bar={CONFIG.footer} align="right" style={{ fontFamily: 'msyh subset, 微软雅黑' }}>
        <a
          href="https://github.com/axiomofchoice-hjt/puzzles"
          target="_blank"
          style={{ color: 'grey', fontSize: 15, textDecoration: 'none', pointerEvents: 'auto' }}
        >
          Github
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            width="15"
            height="15"
            style={{ display: 'inline', position: 'relative', fontSize: 15, bottom: -2, marginLeft: 3 }}
          >
            <path
              fill="currentColor"
              d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
            />
            <polygon
              fill="currentColor"
              points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
            />
          </svg>
        </a>
      </BarText>
    </div>
  )
}

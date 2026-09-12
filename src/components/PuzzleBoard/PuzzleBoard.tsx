import { BlockView } from '@/components/BlockView/BlockView'
import { LineLayer } from '@/components/LineLayer/LineLayer'
import { CONFIG } from '@/game/Config'
import { useGameStore } from '@/store/GameStoreContext'
import styles from './PuzzleBoard.module.css'

export function PuzzleBoard({ width, height }: { width: number; height: number }) {
  const blocks = useGameStore((s) => s.blocks)
  const lines = useGameStore((s) => s.lines)
  const stageWidth = useGameStore((s) => s.stageWidth)
  const stageHeight = useGameStore((s) => s.stageHeight)
  const loadSeq = useGameStore((s) => s.loadSeq)
  if (stageWidth === 0 || width === 0) return null
  const scale = Math.max(
    0,
    Math.min(
      0.8,
      (width - (CONFIG.buttons.size + CONFIG.buttons.right) * 2) / stageWidth,
      (height - CONFIG.header.getHeight() - CONFIG.footer.getHeight()) / stageHeight,
    ),
  )
  return (
    <div
      key={loadSeq}
      data-testid="stage"
      className={styles.stage}
      style={{
        width: stageWidth,
        height: stageHeight,
        top: (height - stageHeight) / 2,
        left: (width - stageWidth) / 2,
        transform: `scale(${scale})`,
      }}
    >
      {blocks.map((b) => (
        <BlockView key={b.id} block={b} />
      ))}
      <LineLayer width={stageWidth} height={stageHeight} lines={lines} />
    </div>
  )
}

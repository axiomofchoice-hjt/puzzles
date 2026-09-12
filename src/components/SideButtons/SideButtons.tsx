import { useState, type ReactNode } from 'react'
import { BackButton } from '@/components/icons/BackButton'
import { RestartButton } from '@/components/icons/RestartButton'
import { TipButton } from '@/components/icons/TipButton'
import { CONFIG } from '@/game/Config'
import { useGameStore } from '@/store/GameStoreContext'
import styles from './SideButtons.module.css'

const COMMON = 'grey'
const HOVER = 'green'
const TIP_HOVER = 'darkorange'
const SVG = CONFIG.buttons.svgSize
const BUTTON_STYLE = {
  padding: (CONFIG.buttons.size - CONFIG.buttons.svgSize) / 2,
  marginBottom: CONFIG.buttons.gap,
}

/** 侧边按钮：hover 时把当前使用的颜色交给 `icon` 渲染，自身不持有业务状态。 */
function SideButton({
  testId,
  hoverColor,
  onClick,
  onHoverChange,
  icon,
}: {
  testId: string
  hoverColor: string
  onClick?: () => void
  onHoverChange?: (hover: boolean) => void
  icon: (color: string) => ReactNode
}) {
  const [hover, setHover] = useState(false)
  const updateHover = (value: boolean) => {
    setHover(value)
    onHoverChange?.(value)
  }
  return (
    <div
      className={styles.button}
      data-testid={testId}
      style={BUTTON_STYLE}
      onMouseOver={() => updateHover(true)}
      onMouseOut={() => updateHover(false)}
      onClick={onClick}
    >
      {icon(hover ? hoverColor : COMMON)}
    </div>
  )
}

export function SideButtons({ width, height }: { width: number; height: number }) {
  const buttons = useGameStore((s) => s.buttons)
  const restart = useGameStore((s) => s.restart)
  const [tipHover, setTipHover] = useState(false)
  const count = [buttons.back.show, buttons.restart.show, buttons.tip.show].filter(Boolean).length
  const top = (height - count * CONFIG.buttons.size - (count - 1) * CONFIG.buttons.gap) / 2
  const left = width - CONFIG.buttons.size - CONFIG.buttons.right
  const tipContentStyle = {
    right: CONFIG.buttons.size,
    fontSize: CONFIG.buttons.tipFontSize,
    lineHeight: `${CONFIG.buttons.tipFontSize}px`,
    margin: `${(CONFIG.buttons.size - CONFIG.buttons.tipHeight) / 2}px 0`,
    padding: (CONFIG.buttons.tipHeight - CONFIG.buttons.tipFontSize) / 2 - 2,
    opacity: buttons.tip.show && tipHover ? 1 : 0,
  }
  return (
    <div style={{ position: 'absolute', top, left }}>
      {buttons.back.show && (
        <SideButton
          testId="btn-back"
          hoverColor={HOVER}
          onClick={() => (window.location.hash = 'home')}
          icon={(color) => <BackButton width={SVG} height={SVG} color={color} />}
        />
      )}
      {buttons.restart.show && (
        <SideButton
          testId="btn-restart"
          hoverColor={HOVER}
          onClick={() => restart()}
          icon={(color) => <RestartButton width={SVG} height={SVG} color={color} />}
        />
      )}
      <div className={styles.tipContent} style={tipContentStyle}>
        {buttons.tipContent}
      </div>
      {buttons.tip.show && (
        <SideButton
          testId="btn-tip"
          hoverColor={TIP_HOVER}
          onHoverChange={setTipHover}
          icon={(color) => <TipButton width={SVG} height={SVG} color={color} />}
        />
      )}
    </div>
  )
}

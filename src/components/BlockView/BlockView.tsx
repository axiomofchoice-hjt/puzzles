import { memo, useEffect, useRef, useState } from 'react'
import { animate, motion } from 'framer-motion'
import { BlockValue } from '@/game/BlockValue'
import { CONFIG } from '@/game/Config'
import { useGameStore } from '@/store/GameStoreContext'
import type { Block } from '@/store/types'
import styles from './BlockView.module.css'

const TRANSITION = { duration: 0.3 }
const INNER_TRANSITION = { default: { duration: 0.15 }, backgroundColor: { duration: 0.3 } }
/** 值→值切换：先淡出，150ms 后再换值淡入。 */
const SWAP_DELAY = 150

const ARROW_PATH =
  'M554.666667 268.8v601.6h-85.333334V268.8L337.066667 401.066667 277.333333 341.333333 512 106.666667 746.666667 341.333333l-59.733334 59.733334L554.666667 268.8z'

const STAR_PATH =
  'M781.186088 616.031873q17.338645 80.573705 30.59761 145.848606 6.119522 27.537849 11.219124 55.075697t9.689243 49.976096 7.649402 38.247012 4.079681 19.888446q3.059761 20.398406-9.179283 27.027888t-27.537849 6.629482q-5.099602 0-14.788845-3.569721t-14.788845-5.609562l-266.199203-155.027888q-72.414343 42.836653-131.569721 76.494024-25.498008 14.278884-50.486056 28.557769t-45.386454 26.517928-35.187251 20.398406-19.888446 10.199203q-10.199203 5.099602-20.908367 3.569721t-19.378486-7.649402-12.749004-14.788845-2.039841-17.848606q1.01992-4.079681 5.099602-19.888446t9.179283-37.737052 11.729084-48.446215 13.768924-54.055777q15.298805-63.23506 34.677291-142.788845-60.175299-52.015936-108.111554-92.812749-20.398406-17.338645-40.286853-34.167331t-35.697211-30.59761-26.007968-22.438247-11.219124-9.689243q-12.239044-11.219124-20.908367-24.988048t-6.629482-28.047809 11.219124-22.438247 20.398406-10.199203l315.155378-28.557769 117.290837-273.338645q6.119522-16.318725 17.338645-28.047809t30.59761-11.729084q10.199203 0 17.848606 4.589641t12.749004 10.709163 8.669323 12.239044 5.609562 10.199203l114.231076 273.338645 315.155378 29.577689q20.398406 5.099602 28.557769 12.239044t8.159363 22.438247q0 14.278884-8.669323 24.988048t-21.928287 26.007968z'

const CHESS_PATHS: Record<string, string> = {
  pawn: 'M402.2 448H352a32 32 0 0 0-32 32v64a32 32 0 0 0 32 32h32v10.98c0 88-8.28 173.2-48 245.02h352c-39.78-71.82-48-157.02-48-245.02V576h32a32 32 0 0 0 32-32v-64a32 32 0 0 0-32-32h-50.2c58.78-36.76 98.2-101.56 98.2-176a208 208 0 0 0-416 0c0 74.44 39.42 139.24 98.2 176zM800 896H224a32 32 0 0 0-32 32v64a32 32 0 0 0 32 32h576a32 32 0 0 0 32-32v-64a32 32 0 0 0-32-32z',
  knight:
    'M166.00007 544.94l81.26 36.12a64 64 0 0 0 49.76 0.94l25.56-10.24a64 64 0 0 0 37.52-41l18.44-61.3a48 48 0 0 1 25.1-31.3L447.88007 416v100.66a96 96 0 0 1-53.06 85.88l-114.44 57.3A160 160 0 0 0 192.00007 802.96V832h639.72V448c0-212-171.84-384-383.84-384H152.00007A24 24 0 0 0 128.00007 88a33.8 33.8 0 0 0 3.58 15.16L160.00007 160l-18 18a48 48 0 0 0-14 34v274.42a64 64 0 0 0 38 58.52zM232.00007 256a40 40 0 1 1-40 40 40 40 0 0 1 40-40z m632 640H160.00007a32 32 0 0 0-32 32v64a32 32 0 0 0 32 32h704a32 32 0 0 0 32-32v-64a32 32 0 0 0-32-32z',
  rook: 'M290.482 430.054C289.914 517.84 282.822 696.152 224 896h575.964c-58.8-199.208-65.872-377.824-66.442-465.95l90.836-84.624a23.996 23.996 0 0 0 7.64-17.56V88c0-13.254-10.746-24-24-24h-80c-13.254 0-24 10.746-24 24v88h-96V88c0-13.254-10.746-24-24-24h-144c-13.254 0-24 10.746-24 24v88H320V88c0-13.254-10.746-24-24-24H216c-13.254 0-24 10.746-24 24v239.864c0 6.66 2.768 13.02 7.64 17.56l90.842 84.63zM448 512c0-35.346 28.654-64 64-64 35.346 0 64 28.654 64 64v128.008h-128V512z m448 440v48c0 13.254-10.746 24-24 24H152c-13.254 0-24-10.746-24-24v-48c0-13.254 10.746-24 24-24h720c13.254 0 24 10.746 24 24z',
}

type Glyph = { d: string; rotate?: number }

/** 箭头 / 星星 / 棋子的矢量图形；数字与文本返回 null。 */
function blockGlyph(v: BlockValue): Glyph | null {
  if (v.isArrow()) return { d: ARROW_PATH, rotate: v.num }
  if (v.isStar()) return { d: STAR_PATH }
  if (v.isChess()) return CHESS_PATHS[v.str] ? { d: CHESS_PATHS[v.str]! } : null
  return null
}

type Anim = 'none' | 'in' | 'out'

/**
 * 把 `block.value` 的变化翻译成渲染用的展示值：
 * - `immediate` 为"立即生效"的值，优先于 `value` 且只消费一次；
 * - 数字之间做补间滚动，其余情况淡出 → 换值 → 淡入。
 */
function useBlockAnimation(value: BlockValue, immediate: BlockValue | null) {
  const [shown, setShown] = useState(value)
  const [displayNum, setDisplayNum] = useState(() => (value.isNum() ? value.num : 0))
  const [anim, setAnim] = useState<Anim>('none')
  const [animKey, setAnimKey] = useState(0)
  const consumedRef = useRef<BlockValue | null>(null)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    const clearTimers = () => {
      for (const t of timersRef.current) window.clearTimeout(t)
      timersRef.current = []
    }
    const after = (ms: number, fn: () => void) => {
      timersRef.current.push(window.setTimeout(fn, ms))
    }
    const applyValue = (v: BlockValue) => {
      setShown(v)
      if (v.isNum()) setDisplayNum(v.num)
    }
    const swapIn = () => {
      applyValue(value)
      setAnimKey((k) => k + 1)
      setAnim('in')
    }

    let prev = shown
    if (immediate && immediate !== consumedRef.current) {
      consumedRef.current = immediate
      applyValue(immediate)
      setAnim('none')
      prev = immediate
    }
    if (BlockValue.eq(value, prev)) return clearTimers
    if (value.isNum() && prev.isNum()) {
      // 数字滚动：framer 补间（若被节流，applyValue 已把终点写入）
      const from = displayNum
      applyValue(value)
      const controls = animate(from, value.num, { duration: 0.3, onUpdate: setDisplayNum })
      return () => controls.stop()
    }
    if (prev.empty()) {
      // 空→值：CSS 关键帧淡入（key 触发重挂载重播动画，最终态 opacity 恒为 1）
      swapIn()
      return clearTimers
    }
    // 值→空 / 值→值：先淡出，再换值淡入
    setAnim('out')
    after(SWAP_DELAY, swapIn)
    return clearTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, value])

  return { shown, displayNum, anim, animKey }
}

function BlockViewImpl({ block }: { block: Block }) {
  const pressSpace = useGameStore((s) => s.pressSpace)
  const blockClick = useGameStore((s) => s.blockClick)
  const [hover, setHover] = useState(false)
  const [pressed, setPressed] = useState(false)
  const { shown, displayNum, anim, animKey } = useBlockAnimation(block.value, block.immediate)

  const size = block.size
  const rel = pressed ? CONFIG.mouseDownSize / CONFIG.blockSize : 1
  const innerSize = size * rel
  const background =
    (hover || pressSpace) && block.clickable
      ? block.background.isLight
        ? block.background.toDark(CONFIG.mouseEnterOpacity)
        : block.background.toLight(CONFIG.mouseEnterLightChange)
      : block.background
  const left = (block.pos.y + 0.5) * CONFIG.blockSize + CONFIG.blockGap * 0.5 - size * 0.5
  const top = (block.pos.x + 0.5) * CONFIG.blockSize + CONFIG.blockGap * 0.5 - size * 0.5
  const text = shown.isNum() ? String(Math.round(displayNum)) : shown.realText
  const fontSize = innerSize * (text.length > 3 ? 0.3 : 0.425)
  const svgSize = innerSize * CONFIG.svgRelativeSize
  const svgPad = (innerSize * (1 - CONFIG.svgRelativeSize)) / 2
  const glyph = blockGlyph(shown)
  const animClass = anim === 'in' ? styles.fadeIn : anim === 'out' ? styles.fadeOut : ''

  return (
    <motion.div
      className={styles.outer}
      data-testid="block"
      data-block-id={block.id}
      data-clickable={block.clickable ? 'true' : 'false'}
      initial={false}
      animate={{ left, top, opacity: block.opacity, rotate: block.rotate }}
      transition={TRANSITION}
      style={{ width: size, height: size, visibility: block.opacity > 0.01 ? 'visible' : 'hidden' }}
      onMouseOver={(e) => {
        setHover(true)
        if ((e.buttons & 1) === 1 && block.clickable) setPressed(true)
      }}
      onMouseLeave={() => {
        setHover(false)
        setPressed(false)
      }}
      onMouseDown={(e) => {
        if ((e.buttons & 1) === 1 && block.clickable) setPressed(true)
      }}
      onMouseUp={(e) => {
        setPressed(false)
        if (e.button === 0 && block.clickable) blockClick(block.id)
      }}
    >
      <motion.div
        className={styles.inner}
        initial={false}
        animate={{
          width: innerSize,
          height: innerSize,
          top: (CONFIG.blockSize * (1 - rel)) / 2,
          left: (CONFIG.blockSize * (1 - rel)) / 2,
          backgroundColor: background.toString(block.backgroundOpacity),
          borderRadius: block.round ? '100%' : '0%',
        }}
        transition={INNER_TRANSITION}
      >
        {(shown.isNum() || shown.isStr()) && (
          <motion.p
            key={animKey}
            className={`${styles.text} ${animClass}`}
            animate={{ color: block.color.toString(1) }}
            transition={{ color: { duration: 0.3 } }}
            style={{ lineHeight: `${innerSize}px`, fontSize }}
          >
            {text}
          </motion.p>
        )}
        {glyph && (
          <div key={animKey} className={`${styles.svgOut} ${animClass}`}>
            <svg
              viewBox="0 0 1024 1024"
              width={svgSize}
              height={svgSize}
              xmlns="http://www.w3.org/2000/svg"
              style={{ padding: svgPad, transform: glyph.rotate ? `rotate(${glyph.rotate}deg)` : undefined }}
            >
              <motion.path
                d={glyph.d}
                animate={{ fill: block.color.toString(1) }}
                transition={{ fill: { duration: 0.3 } }}
              />
            </svg>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export const BlockView = memo(BlockViewImpl)

import { describe, it, expect } from 'vitest'
import { Color } from '@/game/Color'
import type { Level } from '@/game/level'
import type { ProgressLike } from '@/game/progress'
import { createGameStore } from '@/store/gameStore'
import L27 from '../L27'

const stubProgress: ProgressLike = {
  get: () => false,
  set: () => undefined,
  clear: () => undefined,
  count: () => 0,
}

describe('L27 星之战', () => {
  it('init：36 个满格白块可点，19 条 LINES 画成 76 条线', () => {
    const store = createGameStore([L27] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    const s = store.getState()
    expect(s.blocks.length).toBe(36)
    expect(s.blocks.every((b) => b.size === 100)).toBe(true) // blockInnerSize: CONFIG.blockSize
    expect(s.blocks.every((b) => b.background.equal(Color.white))).toBe(true)
    expect(s.blocks.every((b) => b.clickable)).toBe(true)
    expect(s.blocks.every((b) => b.value.empty())).toBe(true)
    expect(s.lines.length).toBe(76) // 19 LINES × drawRect 各 4 条
  })

  it('点 (0,0)：变星，近 8/同行/同列/同区域 标 × 红字不可点', () => {
    const store = createGameStore([L27] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    store.getState().blockClick(0)
    const s = store.getState()
    expect(s.blocks[0]!.value.isStar()).toBe(true)
    expect(s.blocks[0]!.clickable).toBe(true)
    expect(s.tasks[0]!.now).toBe(1)
    // 近 8：1,6,7；同列 (x,0) x≠0：6,12,18,24,30；同行 (0,y) y≠0：1,2,3,4,5；同区域 AREA=0：1,6,7,13,19,25
    const marked = new Set([1, 2, 3, 4, 5, 6, 7, 12, 13, 18, 19, 24, 25, 30])
    for (let i = 0; i < 36; i++) {
      if (marked.has(i)) {
        expect(s.blocks[i]!.value.str, `block ${i}`).toBe('×')
        expect(s.blocks[i]!.color.equal(Color.rgb(255, 0, 0)), `block ${i}`).toBe(true)
        expect(s.blocks[i]!.clickable, `block ${i}`).toBe(false)
      } else if (i !== 0) {
        expect(s.blocks[i]!.value.empty(), `block ${i}`).toBe(true)
        expect(s.blocks[i]!.clickable, `block ${i}`).toBe(true)
      }
    }
  })

  it('两颗互不冲突的星：计数 2；再点取消其中一颗', () => {
    const store = createGameStore([L27] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    store.getState().blockClick(0) // (0,0)
    store.getState().blockClick(8) // (1,2) 不在 (0,0) 的任何冲突范围内
    let s = store.getState()
    expect(s.tasks[0]!.now).toBe(2)
    expect(s.blocks[0]!.value.isStar()).toBe(true)
    expect(s.blocks[8]!.value.isStar()).toBe(true)
    store.getState().blockClick(0) // 取消 (0,0)
    s = store.getState()
    expect(s.blocks[0]!.value.empty()).toBe(true)
    expect(s.blocks[0]!.clickable).toBe(true)
    expect(s.blocks[8]!.value.isStar()).toBe(true)
    expect(s.tasks[0]!.now).toBe(1)
  })
})

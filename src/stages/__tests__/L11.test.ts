import { describe, it, expect } from 'vitest'
import type { Level } from '@/game/level'
import type { ProgressLike } from '@/game/progress'
import { createGameStore } from '@/store/gameStore'
import L11 from '../L11'

const stubProgress: ProgressLike = {
  get: () => false,
  set: () => undefined,
  clear: () => undefined,
  count: () => 0,
}

describe('L11 平移', () => {
  it('init：9 目标块 + 16 按钮，任务初值 3', () => {
    const store = createGameStore([L11] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    const s = store.getState()
    expect(s.blocks.length).toBe(25)
    expect(s.tasks[0]!.now).toBe(3)
  })

  it('点击箭头按钮推动方块（stage 里的 Map 需要 immer enableMapSet）', () => {
    const store = createGameStore([L11] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    const before = (store.getState().stage as { tag: number[] }).tag.slice()
    expect(() => store.getState().blockClick(9)).not.toThrow()
    const after = (store.getState().stage as { tag: number[] }).tag
    expect(after).not.toEqual(before)
  })
})

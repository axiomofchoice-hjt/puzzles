import { describe, it, expect } from 'vitest'
import type { Level } from '@/game/level'
import type { ProgressLike } from '@/game/progress'
import { Color } from '@/game/Color'
import { createGameStore } from '@/store/gameStore'

const fakeLevel: Level<null> = { n: 1, m: 1, init: () => null }
const levels = Array.from({ length: 7 }, () => fakeLevel) as unknown as Level<never>[]
const progress: ProgressLike = {
  get: (id) => id === 0 || id === 4,
  set: () => undefined,
  clear: () => undefined,
  count: () => 2,
}

describe('Home', () => {
  it('init：网格 ceil(7/5)=2 行、编号、完成态着色、任务', () => {
    const store = createGameStore(levels, progress)
    store.getState().loadRoute('home')
    const s = store.getState()
    expect(s.blocks.length).toBe(10)
    expect(s.header.message).toBe('选关')
    expect(s.buttons.back.show).toBe(false)
    expect(s.buttons.tip.show).toBe(true)
    expect(s.buttons.tipContent).toBe('关卡难度没有单调性')
    expect(s.blocks[0]!.background).toEqual(Color.yellow) // 已通关
    expect(s.blocks[1]!.background).toEqual(Color.grey)
    expect(s.blocks[4]!.background).toEqual(Color.yellow)
    expect(s.blocks[0]!.value.num).toBe(1)
    expect(s.blocks[6]!.background).toEqual(Color.grey) // 第 7 关未通关
    expect(s.blocks[7]!.background).toEqual(Color.white) // 超出关卡数
    expect(s.tasks[0]!.now).toBe(2)
    expect(s.tasks[0]!.max).toBe(7)
  })
})

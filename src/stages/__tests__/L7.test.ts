import { describe, it, expect } from 'vitest'
import { Color } from '@/game/Color'
import type { Level } from '@/game/level'
import type { ProgressLike } from '@/game/progress'
import { sumBy } from '@/game/tools'
import { createGameStore } from '@/store/gameStore'
import L7 from '../L7'

const stubProgress: ProgressLike = {
  get: () => false,
  set: () => undefined,
  clear: () => undefined,
  count: () => 0,
}

describe('L7 二进制', () => {
  it('init：2 红 2 绿 10 黄均可点', () => {
    const store = createGameStore([L7] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    const s = store.getState()
    expect(s.blocks.length).toBe(48)
    expect(sumBy(s.blocks, (b) => +(b.background === Color.red))).toBe(2)
    expect(sumBy(s.blocks, (b) => +(b.background === Color.green))).toBe(2)
    expect(sumBy(s.blocks, (b) => +(b.background === Color.yellow))).toBe(10)
    expect(sumBy(s.blocks, (b) => +(b.clickable && b.background === Color.grey))).toBe(0)
  })
})

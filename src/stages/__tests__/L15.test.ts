import { describe, it, expect } from 'vitest'
import type { Level } from '@/game/level'
import type { ProgressLike } from '@/game/progress'
import { Vec } from '@/game/Vec'
import { createGameStore } from '@/store/gameStore'
import L15 from '../L15'

const stubProgress: ProgressLike = {
  get: () => false,
  set: () => undefined,
  clear: () => undefined,
  count: () => 0,
}

describe('L15 交换', () => {
  it('update 按 tag 摆放位置；click 把被点块旋转到末尾', () => {
    const store = createGameStore([L15] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    let s = store.getState()
    const tag0 = [...(s.stage as { tag: number[] }).tag]
    // init 后每块 pos 与 tag 一致
    for (let i = 0; i < 7; i++) {
      expect(s.blocks[tag0[i]!]!.pos).toEqual(new Vec(0, i))
    }
    const id = tag0[0]!
    store.getState().blockClick(id)
    s = store.getState()
    const tag1 = (s.stage as { tag: number[] }).tag
    expect(tag1[6]).toBe(id) // 被点块移到末尾
    expect([...tag1].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6])
    expect(s.blocks[id]!.pos).toEqual(new Vec(0, 6))
  })
})

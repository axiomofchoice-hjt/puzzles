import { describe, it, expect } from 'vitest'
import type { Level } from '@/game/level'
import type { ProgressLike } from '@/game/progress'
import { createGameStore } from '@/store/gameStore'
import L22 from '../L22'

const stubProgress: ProgressLike = {
  get: () => false,
  set: () => undefined,
  clear: () => undefined,
  count: () => 0,
}

describe('L22 赛车', () => {
  it('点箭头推进所有未锁车辆；锁定车不推进', () => {
    const store = createGameStore([L22] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    store.getState().blockClick(54 + 2) // 点 2 号车身 = 锁定它；该次点击同时推进其余车
    let s = store.getState()
    expect((s.stage as { pos: number[] }).pos).toEqual([1, 1, 0, 1, 1])
    for (let i = 0; i < 4; i++) store.getState().blockClick(49) // getId(5,4) = 5*9+4
    s = store.getState()
    expect((s.stage as { pos: number[] }).pos).toEqual([5, 5, 0, 5, 5])
    expect(s.tasks[0]!.now).toBe(2) // RESULT=[8,5,7,5,8] → 命中 1、3 号车
  })
})

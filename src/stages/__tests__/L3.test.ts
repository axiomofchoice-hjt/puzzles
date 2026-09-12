import { describe, it, expect } from 'vitest'
import type { Level } from '@/game/level'
import type { ProgressLike } from '@/game/progress'
import { createGameStore } from '@/store/gameStore'
import L3 from '../L3'

const stubProgress: ProgressLike = {
  get: () => false,
  set: () => undefined,
  clear: () => undefined,
  count: () => 0,
}

describe('L3 扫雷', () => {
  it('标 3 块 → 邻域计数与出现数字种类', () => {
    const store = createGameStore([L3] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    for (const id of [6, 8, 16]) store.getState().blockClick(id) // (1,1),(1,3),(3,1)
    const s = store.getState()
    expect(s.blocks[6]!.value.str).toBe('') // tag 块本身
    expect(s.blocks[7]!.value.str).toBe('2') // (1,2) 邻 (1,1),(1,3)
    expect(s.blocks[11]!.value.str).toBe('2') // (2,1) 邻 (1,1),(3,1)
    expect(s.blocks[12]!.value.str).toBe('3') // (2,2) 邻全部三块
    expect(s.blocks[13]!.value.str).toBe('1') // (2,3) 邻 (1,3)
    expect(s.blocks[0]!.value.str).toBe('1') // (0,0) 邻 (1,1)
    expect(s.tasks[0]!.now).toBe(3) // 出现过的数字种类 {1,2,3}
  })
})

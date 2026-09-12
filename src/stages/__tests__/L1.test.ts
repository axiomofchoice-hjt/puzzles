import { describe, it, expect } from 'vitest'
import { Color } from '@/game/Color'
import type { Level } from '@/game/level'
import type { ProgressLike } from '@/game/progress'
import { createGameStore } from '@/store/gameStore'
import L1 from '../L1'

const stubProgress: ProgressLike = {
  get: () => false,
  set: () => undefined,
  clear: () => undefined,
  count: () => 0,
}
const store = () => createGameStore([L1] as unknown as Level<never>[], stubProgress)

describe('L1 填充', () => {
  it('点 (1,2)=id7：行列变蓝；再点 (2,2)=id12：3×3 变黄', () => {
    const s0 = store()
    s0.getState().loadRoute('1')
    s0.getState().blockClick(7)
    let s = s0.getState()
    expect(s.blocks[7]!.background).toEqual(Color.blue)
    expect(s.blocks[5]!.background).toEqual(Color.blue) // 同行
    expect(s.blocks[2]!.background).toEqual(Color.blue) // 同列
    expect(s.blocks[0]!.background).toEqual(Color.grey) // 无关块
    s0.getState().blockClick(12)
    s = s0.getState()
    expect(s.blocks[12]!.background).toEqual(Color.yellow)
    expect(s.blocks[11]!.background).toEqual(Color.yellow) // (2,1) 在 3×3 内
    expect(s.blocks[6]!.background).toEqual(Color.yellow) // (1,1) 在 3×3 内（原蓝色）
    expect(s.blocks[6]!.clickable).toBe(false)
    expect(s.blocks[9]!.background).toEqual(Color.blue) // (1,4) 不在 3×3 内，保持蓝
    expect(s.tasks[0]!.now).toBe(12) // |row1 ∪ col2 ∪ 3×3| = 8 + 9 - 5
  })
})

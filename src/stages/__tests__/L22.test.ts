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

  it('车移动时赛道格永不消失（含车所在的目标格）', () => {
    const store = createGameStore([L22] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    /** 5 条赛道（x=0..4）每列 9 格的可见性：`G`=灰色赛道可见，`.`=被隐藏 */
    const track = () => {
      const s = store.getState()
      const rows: string[] = []
      for (let i = 0; i < 5; i++) {
        let row = ''
        for (let y = 0; y < 9; y++) row += s.blocks[i * 9 + y]!.opacity === 0 ? '.' : 'G'
        rows.push(row)
      }
      return rows
    }
    const FULL = ['GGGGGGGGG', 'GGGGGGGGG', 'GGGGGGGGG', 'GGGGGGGGG', 'GGGGGGGGG']

    expect(track()).toEqual(FULL)
    // 一步一步推进，每一步赛道都必须完整可见 —— 包括车正下方那一格
    for (let step = 1; step <= 9; step++) {
      store.getState().blockClick(49)
      expect((store.getState().stage as { pos: number[] }).pos).toEqual([step, step, step, step, step])
      expect(track()).toEqual(FULL)
    }

    // 第 6 列是控制列：始终只有箭头 (5,4) 可见
    const s = store.getState()
    for (let y = 0; y < 9; y++) {
      expect(s.blocks[5 * 9 + y]!.opacity).toBe(y === 4 ? 1 : 0)
    }
  })
})

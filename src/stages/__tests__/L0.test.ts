import { describe, it, expect } from 'vitest'
import { Color } from '@/game/Color'
import type { Level } from '@/game/level'
import type { ProgressLike } from '@/game/progress'
import { createGameStore } from '@/store/gameStore'
import L0 from '../L0'

const stubProgress: ProgressLike = {
  get: () => false,
  set: () => undefined,
  clear: () => undefined,
  count: () => 0,
}

describe('L0 猜数', () => {
  it('init：1..31 编号可点击，最后一块白且不可点', () => {
    const store = createGameStore([L0] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    const s = store.getState()
    expect(s.blocks.length).toBe(32)
    expect(s.blocks[0]!.value.num).toBe(1)
    expect(s.blocks[30]!.clickable).toBe(true)
    expect(s.blocks[31]!.background).toEqual(Color.white)
    expect(s.blocks[31]!.clickable).toBe(false)
  })
  it('二分：点 10（左半）→ 上箭头 270° 黄，L 收缩到 11', () => {
    const store = createGameStore([L0] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    store.getState().blockClick(10) // 20 < 0+30 → 必走 270 分支（无随机）
    const s = store.getState()
    const b = s.blocks[10]!
    expect(b.value.isArrow()).toBe(true)
    expect(b.value.num).toBe(270)
    expect(b.background).toEqual(Color.yellow)
    expect(b.rotate).toBe(180)
    expect(b.clickable).toBe(false)
    expect((s.stage as { L: number; R: number }).L).toBe(11)
    expect(s.tasks[1]!.now).toBe(1)
  })
  it('点 25 → 90° 蓝，R 收缩到 24', () => {
    const store = createGameStore([L0] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    store.getState().blockClick(10)
    store.getState().blockClick(25) // 50 > 11+30=41 → 90 分支
    const s = store.getState()
    expect(s.blocks[25]!.value.num).toBe(90)
    expect(s.blocks[25]!.background).toEqual(Color.blue)
    expect((s.stage as { L: number; R: number }).R).toBe(24)
  })
  it('确定路径收敛到 24 → ok', () => {
    const store = createGameStore([L0] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    for (const id of [10, 25, 17, 20, 22, 23, 24]) store.getState().blockClick(id)
    const s = store.getState()
    const b = s.blocks[24]!
    expect(b.value.str).toBe('ok')
    expect(b.background).toEqual(Color.red)
    expect(s.tasks[0]!.now).toBe(1)
  })

  it('点击会更新任务计数且产生新的 Task 引用（immer 需追踪 class 实例）', () => {
    const store = createGameStore([L0] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    const before = store.getState().tasks[1]!
    store.getState().blockClick(10)
    const after = store.getState().tasks[1]!
    expect(after.now).toBe(1)
    expect(after).not.toBe(before)
  })
})

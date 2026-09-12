import { describe, it, expect } from 'vitest'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import type { ProgressLike } from '@/game/progress'
import { createGameStore } from '../gameStore'

const stubProgress: ProgressLike = {
  get: () => false,
  set: () => undefined,
  clear: () => undefined,
  count: () => 0,
}

const fixture: Level<{ count: number }> = {
  n: 2,
  m: 2,
  headerMessage: '测试关',
  tasks: [[0, 1, Task.eq]],
  init() {
    return { count: 0 }
  },
  click(s, id, game) {
    s.count++
    game.tasks[0].set(1)
    game.get(id).clickable = false
  },
}

describe('createGameStore', () => {
  it('loadRoute 装配关卡', () => {
    const store = createGameStore([fixture] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    const s = store.getState()
    expect(s.header.message).toBe('测试关')
    expect(s.header.level).toBe(1)
    expect(s.blocks.length).toBe(4)
    expect(s.stageWidth).toBe(100 * 2 + 8)
    expect(s.stageHeight).toBe(100 * 2 + 8)
    expect(s.tasks[0]!.now).toBe(0)
  })
  it('blockClick 派发并保持未变 block 引用稳定（immer）', () => {
    const store = createGameStore([fixture] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    const b0 = store.getState().blocks[0]
    store.getState().blockClick(1)
    const s = store.getState()
    expect((s.stage as { count: number }).count).toBe(1)
    expect(s.blocks[0]).toBe(b0)
    expect(s.blocks[1]).not.toBe(b0)
  })
})

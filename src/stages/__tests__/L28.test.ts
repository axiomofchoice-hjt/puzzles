import { describe, it, expect } from 'vitest'
import { Color } from '@/game/Color'
import type { Level } from '@/game/level'
import type { ProgressLike } from '@/game/progress'
import { createGameStore } from '@/store/gameStore'
import L28 from '../L28'

const stubProgress: ProgressLike = {
  get: () => false,
  set: () => undefined,
  clear: () => undefined,
  count: () => 0,
}

describe('L28 独棋', () => {
  it('init：64 格棋盘灰白相间黑字，6 个满格透明背景棋子按源顺序可点', () => {
    const store = createGameStore([L28] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    const s = store.getState()
    expect(s.blocks.length).toBe(70)
    expect(s.blocks[0]!.background.equal(Color.white)).toBe(true) // (0,0) 和为偶
    expect(s.blocks[1]!.background.equal(Color.grey)).toBe(true)
    expect(s.blocks.every((b) => b.color.equal(Color.black))).toBe(true)
    expect(s.blocks.slice(0, 64).every((b) => !b.clickable)).toBe(true)
    // set 调用顺序：knight(5,2) knight(5,3) pawn(4,3) pawn(4,4) pawn(2,5) rook(3,4) → id 64..69
    expect(s.blocks[64]!.value.str).toBe('knight')
    expect(s.blocks[64]!.pos.x).toBe(5)
    expect(s.blocks[64]!.pos.y).toBe(2)
    expect(s.blocks[65]!.value.str).toBe('knight')
    expect(s.blocks[66]!.value.str).toBe('pawn')
    expect(s.blocks[67]!.value.str).toBe('pawn')
    expect(s.blocks[68]!.value.str).toBe('pawn')
    expect(s.blocks[69]!.value.str).toBe('rook')
    expect(s.blocks[69]!.pos.x).toBe(3)
    expect(s.blocks[69]!.pos.y).toBe(4)
    for (const i of [64, 65, 66, 67, 68, 69]) {
      expect(s.blocks[i]!.clickable).toBe(true)
      expect(s.blocks[i]!.backgroundOpacity).toBe(0)
      expect(s.blocks[i]!.size).toBe(100)
    }
  })

  it('选 knight(5,2)：所在格 42 黄，仅 pawn(4,4)（|dx|+|dy|=3）格 36 蓝', () => {
    const store = createGameStore([L28] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    store.getState().blockClick(64)
    const s = store.getState()
    expect(s.blocks[42]!.background.equal(Color.yellow)).toBe(true) // get(5,2) = 5*8+2
    const blues = s.blocks.slice(0, 64).filter((b) => b.background.equal(Color.blue))
    expect(blues.length).toBe(1)
    expect(s.blocks[36]!.background.equal(Color.blue)).toBe(true) // get(4,4) = 4*8+4
  })

  it('吃子：点蓝格上的 pawn(4,4) → 其被吃 + 黄格 knight 移位 + 计数 + 棋盘恢复', () => {
    const store = createGameStore([L28] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    store.getState().blockClick(64) // 选 knight(5,2) → 格 42 黄、格 36 蓝
    store.getState().blockClick(67) // 点 pawn(4,4)，其所在格为蓝
    const s = store.getState()
    expect(s.blocks[67]!.opacity).toBe(0)
    expect(s.blocks[67]!.clickable).toBe(false)
    expect(s.blocks[64]!.pos.x).toBe(4)
    expect(s.blocks[64]!.pos.y).toBe(4)
    expect(s.tasks[0]!.now).toBe(1)
    expect(s.blocks[42]!.background.equal(Color.grey)).toBe(true) // (5+2)%2=1
    expect(s.blocks[36]!.background.equal(Color.white)).toBe(true) // (4+4)%2=0
  })

  it('两段式：第二击点非蓝棋子 → 不吃子不移动，恢复棋盘，choose 复位', () => {
    const store = createGameStore([L28] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    store.getState().blockClick(64) // 选 knight(5,2)
    store.getState().blockClick(65) // 点 knight(5,3)，格 43 非蓝
    const s = store.getState()
    expect(s.blocks[67]!.opacity).toBe(1)
    expect(s.blocks[64]!.pos.x).toBe(5)
    expect(s.blocks[64]!.pos.y).toBe(2)
    expect(s.tasks[0]!.now).toBe(0)
    expect(s.blocks[42]!.background.equal(Color.grey)).toBe(true)
    expect(s.blocks[36]!.background.equal(Color.white)).toBe(true)
    store.getState().blockClick(64) // choose 已复位 → 再次进入选子
    expect(store.getState().blocks[42]!.background.equal(Color.yellow)).toBe(true)
  })

  it('rook 选子 (dx===0)!==(dy===0)：仅 pawn(4,4) 蓝；pawn 选子 x===x-1 且 |dy|=1：仅 rook 蓝', () => {
    const store = createGameStore([L28] as unknown as Level<never>[], stubProgress)
    store.getState().loadRoute('1')
    store.getState().blockClick(69) // rook(3,4)
    let s = store.getState()
    let blues = s.blocks.slice(0, 64).filter((b) => b.background.equal(Color.blue))
    expect(blues.length).toBe(1)
    expect(s.blocks[36]!.background.equal(Color.blue)).toBe(true)
    store.getState().blockClick(68) // 点 pawn(2,5)，格 21 非蓝 → 取消
    store.getState().blockClick(66) // pawn(4,3)
    s = store.getState()
    blues = s.blocks.slice(0, 64).filter((b) => b.background.equal(Color.blue))
    expect(blues.length).toBe(1)
    expect(s.blocks[28]!.background.equal(Color.blue)).toBe(true) // get(3,4) = 3*8+4
    store.getState().blockClick(69) // 吃 rook
    s = store.getState()
    expect(s.blocks[66]!.pos.x).toBe(3)
    expect(s.blocks[66]!.pos.y).toBe(4)
    expect(s.tasks[0]!.now).toBe(1)
  })
})

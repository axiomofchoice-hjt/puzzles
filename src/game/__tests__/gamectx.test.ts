import { describe, it, expect } from 'vitest'
import { GameCtx } from '../GameCtx'
import { Progress } from '../progress'
import { makeBlock, type GameState } from '@/store/types'
import { Vec } from '../Vec'

function makeCtx(n: number, m: number): { ctx: GameCtx; state: GameState } {
  const state: GameState = {
    route: '1',
    stage: null,
    blocks: [],
    lines: [],
    header: { level: 1, message: '' },
    tasks: [],
    buttons: { back: { show: true }, restart: { show: true }, tip: { show: false }, tipContent: '' },
    bonus: { content: '', show: false },
    pressSpace: false,
    stageWidth: 0,
    stageHeight: 0,
    loadSeq: 0,
  }
  for (let i = 0; i < n * m; i++) state.blocks.push(makeBlock(i, { pos: new Vec(Math.floor(i / m), i % m) }))
  const ctx = new GameCtx(state, n, m, 29, new Progress(29))
  return { ctx, state }
}

describe('GameCtx', () => {
  it('get/getId/getVec/getXY 与原 Grid 语义一致', () => {
    const { ctx } = makeCtx(3, 4)
    expect(ctx.size).toBe(12)
    expect(ctx.getId(5)).toBe(5)
    expect(ctx.getId(2, 3)).toBe(11)
    expect(ctx.getId(new Vec(2, 3))).toBe(11)
    expect(ctx.getVec(11)).toEqual(new Vec(2, 3))
    expect(ctx.getXY(11)).toEqual([2, 3])
    expect(ctx.get(2, 3)).toBe(ctx.blocks[11])
    expect(ctx.get(new Vec(0, 1))).toBe(ctx.blocks[1])
  })
  it('inArea', () => {
    const { ctx } = makeCtx(3, 4)
    expect(ctx.inArea(2, 3)).toBe(true)
    expect(ctx.inArea(3, 0)).toBe(false)
    expect(ctx.inArea(new Vec(0, 4))).toBe(false)
  })
  it('addBlock 追加并返回', () => {
    const { ctx } = makeCtx(1, 1)
    const b = ctx.addBlock({ pos: new Vec(5, 5) })
    expect(b.id).toBe(1)
    expect(ctx.blocks.length).toBe(2)
  })
  it('showBonus/setTip/setTasks', () => {
    const { ctx, state } = makeCtx(1, 1)
    ctx.showBonus('hi')
    expect(state.bonus).toEqual({ content: 'hi', show: true })
    ctx.setTip('t')
    expect(state.buttons.tip.show).toBe(true)
    ctx.setTasks([
      [1, 2, (a, b) => (a === b ? 1 : 0)],
    ])
    expect(state.tasks[0]!.ok()).toBe(false)
    expect(state.tasks[0]!.max).toBe(2)
  })
})

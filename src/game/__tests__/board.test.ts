import { describe, expect, it } from 'vitest'
import { box9Ids, clearValues, crossIds, fillBoard, forEachBlock, nearIds } from '../board'
import { numValue } from '../BlockValue'
import { Color } from '../Color'
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
  for (let i = 0; i < n * m; i++) {
    state.blocks.push(makeBlock(i, { pos: new Vec(Math.floor(i / m), i % m) }))
  }
  return { ctx: new GameCtx(state, n, m, 29, new Progress(29)), state }
}

describe('board', () => {
  it('forEachBlock 按 id 顺序访问全部预置方块', () => {
    const { ctx } = makeCtx(2, 3)
    const seen: number[] = []
    forEachBlock(ctx, (_block, id) => seen.push(id))
    expect(seen).toEqual([0, 1, 2, 3, 4, 5])
  })

  it('fillBoard 只覆盖列出的字段，未列出的保持不变', () => {
    const { ctx } = makeCtx(1, 2)
    ctx.get(0).value = numValue(7)
    fillBoard(ctx, { background: Color.grey })
    expect(ctx.get(0).background).toEqual(Color.grey)
    expect(ctx.get(1).background).toEqual(Color.grey)
    expect(ctx.get(0).value.num).toBe(7)
    expect(ctx.get(0).clickable).toBe(false)
  })

  it('fillBoard 支持按 id 生成初值', () => {
    const { ctx } = makeCtx(1, 3)
    fillBoard(ctx, (id) => ({ value: numValue(id + 1) }))
    expect(ctx.blocks.map((b) => b.value.num)).toEqual([1, 2, 3])
  })

  it('clearValues 清空所有值', () => {
    const { ctx } = makeCtx(1, 2)
    fillBoard(ctx, (id) => ({ value: numValue(id) }))
    clearValues(ctx)
    expect(ctx.blocks.every((b) => b.value.empty())).toBe(true)
  })

  it('nearIds 四邻只返回盘内 id，顺序与 near4 一致', () => {
    const { ctx } = makeCtx(3, 3)
    expect(nearIds(ctx, new Vec(1, 1))).toEqual([1, 5, 7, 3])
    expect(nearIds(ctx, new Vec(0, 0))).toEqual([1, 3])
    expect(nearIds(ctx, new Vec(0, 0), { includeSelf: true })).toEqual([0, 1, 3])
    expect(nearIds(ctx, new Vec(1, 1), { diagonal: true })).toHaveLength(8)
  })

  it('box9Ids 含自身且按 id 升序，边界处自动裁剪', () => {
    const { ctx } = makeCtx(3, 3)
    expect(box9Ids(ctx, new Vec(1, 1))).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
    expect(box9Ids(ctx, new Vec(0, 0))).toEqual([0, 1, 3, 4])
  })

  it('crossIds 是所在行与列的并集（含自身）', () => {
    const { ctx } = makeCtx(3, 3)
    expect(crossIds(ctx, new Vec(1, 1))).toEqual([1, 3, 4, 5, 7])
    expect(crossIds(ctx, new Vec(0, 2))).toEqual([0, 1, 2, 5, 8])
  })
})

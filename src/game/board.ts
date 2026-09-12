import type { GameCtx } from './GameCtx'
import type { Block, BlockInit } from '@/store/types'
import { emptyValue } from './BlockValue'
import { near4, near8 } from './tools'
import type { Vec } from './Vec'

/**
 * 棋盘工具：`loadRoute` 会为绝大多数关卡预置 n×m 个方块，
 * 这里集中处理"整盘重绘""邻域枚举"等重复模式。
 * 约定：遍历范围是 `game.size`，不含关卡用 `addBlock` 追加的方块。
 */

/** 按 id 顺序遍历预置方块。 */
export function forEachBlock(game: GameCtx, fn: (block: Block, id: number) => void): void {
  for (let i = 0; i < game.size; i++) fn(game.get(i), i)
}

/** 给整盘方块套用同一组初值；未列出的字段保持不变。 */
export function fillBoard(game: GameCtx, init: BlockInit | ((id: number) => BlockInit)): void {
  const at = typeof init === 'function' ? init : () => init
  forEachBlock(game, (block, id) => Object.assign(block, at(id)))
}

/** 清空整盘方块上的值。 */
export function clearValues(game: GameCtx): void {
  fillBoard(game, () => ({ value: emptyValue() }))
}

/** 邻域中落在棋盘内的 id（四邻，`diagonal` 时八邻）。顺序与 `near4`/`near8` 一致。 */
export function nearIds(
  game: GameCtx,
  v: Vec,
  options?: { diagonal?: boolean; includeSelf?: boolean },
): number[] {
  const around = options?.diagonal ? near8(v) : near4(v)
  const cells = options?.includeSelf ? [v, ...around] : around
  return cells.filter((p) => game.inArea(p)).map((p) => game.getId(p))
}

/** 以 v 为中心的 3×3（含自身）内、落在棋盘内的 id，按 id 升序。 */
export function box9Ids(game: GameCtx, v: Vec): number[] {
  const res: number[] = []
  for (let i = 0; i < game.size; i++) {
    const p = game.getVec(i)
    if (Math.abs(p.x - v.x) <= 1 && Math.abs(p.y - v.y) <= 1) res.push(i)
  }
  return res
}

/** v 所在行与列（含自身）内、落在棋盘内的 id，按 id 升序。 */
export function crossIds(game: GameCtx, v: Vec): number[] {
  const res: number[] = []
  for (let i = 0; i < game.size; i++) {
    const p = game.getVec(i)
    if (p.x === v.x || p.y === v.y) res.push(i)
  }
  return res
}

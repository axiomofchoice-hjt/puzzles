import { Vec } from './Vec'

export function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed')
}

export function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i)
}

export function inRange(x: number, lo: number, hi: number): boolean {
  return x >= lo && x < hi
}

export function sum(a: readonly number[]): number {
  return a.reduce((x, y) => x + y, 0)
}

export function sumBy<T>(a: readonly T[], f: (x: T) => number): number {
  return a.reduce((x, y) => x + f(y), 0)
}

export function count<T>(a: readonly T[], pred: (x: T) => boolean): number {
  return a.reduce((n, x) => n + (pred(x) ? 1 : 0), 0)
}

export function countRange(n: number, pred: (i: number) => boolean): number {
  let total = 0
  for (let i = 0; i < n; i++) if (pred(i)) total++
  return total
}

export function genArray<T>(n: number, el: (id: number) => T): T[] {
  return range(n).map(el)
}

export function random(n: number): number {
  return Math.floor(Math.random() * n)
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = random(i + 1)
    ;[a[i]!, a[j]!] = [a[j]!, a[i]!]
  }
  return a
}

/** 按行优先遍历 n×m 矩阵，产出 `[i, j]`。 */
export function* rangeMatrix(n: number, m: number): Generator<[number, number]> {
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) yield [i, j]
}

/** 为任意可迭代对象补上从 0 开始的序号。 */
export function* enumerate<T>(it: Iterable<T>): Generator<[number, T]> {
  let index = 0
  for (const item of it) yield [index++, item]
}

/** 四邻域，顺序固定为上、右、下、左（`directionId` 依赖该顺序）。 */
export function near4(v: Vec): Vec[] {
  return [
    new Vec(v.x - 1, v.y),
    new Vec(v.x, v.y + 1),
    new Vec(v.x + 1, v.y),
    new Vec(v.x, v.y - 1),
  ]
}

/** 八邻域，从上方开始顺时针。 */
export function near8(v: Vec): Vec[] {
  return [
    new Vec(v.x - 1, v.y),
    new Vec(v.x - 1, v.y + 1),
    new Vec(v.x, v.y + 1),
    new Vec(v.x + 1, v.y + 1),
    new Vec(v.x + 1, v.y),
    new Vec(v.x + 1, v.y - 1),
    new Vec(v.x, v.y - 1),
    new Vec(v.x - 1, v.y - 1),
  ]
}

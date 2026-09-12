import { Color } from './Color'
import { CONFIG } from './Config'
import { Vec } from './Vec'

export class Line {
  id: number
  pos: [Vec, Vec]
  color: Color
  width: number
  opacity: number
  show: boolean
  constructor(
    id: number,
    options?: { pos?: [Vec, Vec]; color?: Color; width?: number; opacity?: number; show?: boolean },
  ) {
    this.id = id
    this.pos = options?.pos ?? [new Vec(0, 0), new Vec(0, 0)]
    this.color = options?.color ?? Color.black
    this.width = options?.width ?? 1
    this.opacity = options?.opacity ?? 1
    this.show = options?.show ?? true
  }
}

type LineOptions = { color?: Color; width?: number; opacity?: number; show?: boolean }

/** 把矩形的四条边依次追加到 `lines`（左上、左下、右下、右上，id 连续）。 */
export function drawRect(
  lines: Line[],
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  options?: LineOptions,
): void {
  // 角点顺序需与 drawRect 既有行为一致：0=左上, 1=左下, 2=右上, 3=右下
  const corners = [new Vec(x1, y1), new Vec(x1, y2), new Vec(x2, y1), new Vec(x2, y2)] as const
  const edges = [
    [0, 1],
    [1, 3],
    [3, 2],
    [2, 0],
  ] as const
  for (const [i, j] of edges) {
    lines.push(new Line(lines.length, { pos: [corners[i], corners[j]], ...options }))
  }
}

/** 用格坐标画矩形（格坐标为方块索引，取格子间隙中点）。 */
export function drawGridRect(lines: Line[], from: Vec, to: Vec, options?: LineOptions): void {
  const a = CONFIG.grid.getGapMid(from)
  const b = CONFIG.grid.getGapMid(to)
  drawRect(lines, a.x, a.y, b.x, b.y, options)
}

/** 用格坐标画一条线。 */
export function drawGridLine(lines: Line[], from: Vec, to: Vec, options?: LineOptions): void {
  const a = CONFIG.grid.getGapMid(from)
  const b = CONFIG.grid.getGapMid(to)
  lines.push(new Line(lines.length, { pos: [a, b], ...options }))
}

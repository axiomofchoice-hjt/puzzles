import { describe, it, expect } from 'vitest'
import { Color } from '../Color'
import { drawRect, Line } from '../Line'

describe('drawRect', () => {
  it('生成 4 条边线且坐标正确', () => {
    const lines: Line[] = []
    drawRect(lines, 8, 8, 100, 200, { width: 2, color: Color.blue })
    expect(lines.length).toBe(4)
    expect(lines.map((l) => l.id)).toEqual([0, 1, 2, 3])
    expect(lines[0]!.pos).toEqual([
      { x: 8, y: 8 },
      { x: 8, y: 200 },
    ])
    expect(lines[1]!.pos).toEqual([
      { x: 8, y: 200 },
      { x: 100, y: 200 },
    ])
    expect(lines[2]!.pos).toEqual([
      { x: 100, y: 200 },
      { x: 100, y: 8 },
    ])
    expect(lines[3]!.pos).toEqual([
      { x: 100, y: 8 },
      { x: 8, y: 8 },
    ])
    expect(lines[0]!.width).toBe(2)
  })
})

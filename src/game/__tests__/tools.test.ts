import { describe, it, expect } from 'vitest'
import { inRange, near4, near8, random, range, shuffle, sumBy } from '../tools'
import { Vec } from '../Vec'

describe('tools', () => {
  it('range/inRange/sumBy', () => {
    expect(range(3)).toEqual([0, 1, 2])
    expect(inRange(2, 0, 5)).toBe(true)
    expect(inRange(5, 0, 5)).toBe(false)
    expect(sumBy([1, 2, 3], (x) => x * 2)).toBe(12)
  })
  it('near4 顺序必须是 上,右,下,左（directionId 依赖）', () => {
    expect(near4(new Vec(2, 2))).toEqual([
      new Vec(1, 2),
      new Vec(2, 3),
      new Vec(3, 2),
      new Vec(2, 1),
    ])
  })
  it('near8 相对 (x,y) 从上开始顺时针', () => {
    expect(near8(new Vec(0, 0))[0]).toEqual(new Vec(-1, 0))
    expect(near8(new Vec(0, 0)).length).toBe(8)
  })
  it('shuffle 保持元素集合且不改原数组', () => {
    const a = [1, 2, 3, 4, 5]
    const b = shuffle(a)
    expect([...b].sort((x, y) => x - y)).toEqual(a)
    expect(a).toEqual([1, 2, 3, 4, 5])
  })
  it('random 落在 [0,n)', () => {
    for (let i = 0; i < 100; i++) expect(random(5)).toBeLessThan(5)
  })
})

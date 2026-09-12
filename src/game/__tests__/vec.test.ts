import { describe, it, expect } from 'vitest'
import { Vec } from '../Vec'

describe('Vec', () => {
  it('代数运算', () => {
    expect(Vec.add(new Vec(1, 2), new Vec(3, 4))).toEqual(new Vec(4, 6))
    expect(Vec.sub(new Vec(3, 4), new Vec(1, 2))).toEqual(new Vec(2, 2))
    expect(Vec.mul(new Vec(1, 2), 3)).toEqual(new Vec(3, 6))
    expect(new Vec(-3, 8).sum()).toBe(11)
    expect(new Vec(-3, 8).max()).toBe(8)
    expect(new Vec(-3, 8).min()).toBe(-3)
    expect(Vec.equal(new Vec(1, 1), new Vec(1, 1))).toBe(true)
  })
})

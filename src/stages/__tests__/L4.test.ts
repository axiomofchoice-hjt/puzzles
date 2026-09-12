import { describe, it, expect } from 'vitest'
import { Frac } from '../L4'

describe('Frac（L4）', () => {
  it('约分与符号', () => {
    expect(new Frac(2, 4, 1).toString()).toBe('1/2')
    expect(new Frac(-3, 6, 1).toString()).toBe('-1/2')
    expect(new Frac(5, 1, 1).toString()).toBe('5')
  })
  it('特殊值', () => {
    expect(new Frac(0, 0, 1).toString()).toBe('★')
    expect(new Frac(1, 0, 1).toString()).toBe('+∞')
    expect(new Frac(1, 0, -1).toString()).toBe('-∞')
  })
  it('四则运算', () => {
    const a = new Frac(1, 3, 1)
    const b = new Frac(1, 6, 1)
    expect(Frac.add(a, b).toString()).toBe('1/2')
    expect(Frac.mul(a, b).toString()).toBe('1/18')
    expect(Frac.div(a, b).toString()).toBe('2')
    expect(Frac.sub(b, a).toString()).toBe('-1/6')
  })
})

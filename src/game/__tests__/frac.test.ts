import { describe, expect, it } from 'vitest'
import { Frac } from '../Frac'

const f = (u: number, d: number, sign = 1) => new Frac(u, d, sign)

describe('Frac', () => {
  it('约分与符号归一化', () => {
    expect(f(2, 4).toString()).toBe('1/2')
    expect(f(-2, 4).toString()).toBe('-1/2')
    expect(f(2, -4).toString()).toBe('-1/2')
    expect(f(4, 2).toString()).toBe('2')
    expect(f(0, 5).toString()).toBe('0')
  })

  it('★ 与 ±∞', () => {
    expect(f(0, 0).toString()).toBe('★')
    expect(f(1, 0, 1).toString()).toBe('+∞')
    expect(f(1, 0, -1).toString()).toBe('-∞')
  })

  it('四则运算', () => {
    expect(Frac.add(f(1, 2), f(1, 3)).toString()).toBe('5/6')
    expect(Frac.sub(f(1, 2), f(1, 3)).toString()).toBe('1/6')
    expect(Frac.mul(f(2, 3), f(3, 4)).toString()).toBe('1/2')
    expect(Frac.div(f(1, 2), f(3, 4)).toString()).toBe('2/3')
  })

  it('compare 可用于排序（负数在前）', () => {
    const list = [f(1, 2), f(-1, 2), f(3, 4), f(0, 1)]
    list.sort(Frac.compare)
    expect(list.map((x) => x.toString())).toEqual(['-1/2', '0', '1/2', '3/4'])
  })
})

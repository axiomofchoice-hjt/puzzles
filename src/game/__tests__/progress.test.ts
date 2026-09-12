import { describe, it, expect } from 'vitest'
import { decodeProgress, encodeProgress } from '../progress'

describe('progress codec', () => {
  it('round-trip', () => {
    const ok = [true, false, true, true, false, false, false, false, true]
    expect(decodeProgress(encodeProgress(ok), ok.length)).toEqual(ok)
  })
  it('与旧版格式兼容：末位 hex 字符编码前 4 关（bit0..3）', () => {
    expect(decodeProgress('1', 4)).toEqual([true, false, false, false])
    expect(decodeProgress('f', 4)).toEqual([true, true, true, true])
    expect(decodeProgress('5', 4)).toEqual([true, false, true, false])
    expect(encodeProgress([true, false, true, false, false, false, false, false])).toBe('5')
  })
  it('undefined / 长度不足安全', () => {
    expect(decodeProgress(undefined, 3)).toEqual([false, false, false])
    const ok = decodeProgress('ff', 100)
    expect(ok.length).toBe(100)
    expect(ok[7]).toBe(true)
    expect(ok[8]).toBe(false)
  })
})

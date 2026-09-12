import { describe, it, expect } from 'vitest'
import { Color } from '../Color'

describe('Color', () => {
  it('预设色', () => {
    expect(Color.grey).toEqual(Color.rgb(211, 211, 211))
    expect(Color.blue).toEqual(Color.rgb(0, 191, 255))
  })
  it('isLight 定义为"非纯白"', () => {
    expect(Color.white.isLight).toBe(false)
    expect(Color.grey.isLight).toBe(true)
    expect(Color.black.isLight).toBe(true)
  })
  it('toDark/toLight 与 hex 输出', () => {
    const grey = Color.rgb(211, 211, 211)
    expect(grey.toDark(0.7)).toEqual(Color.rgb(224, 224, 224))
    expect(Color.rgb(100, 0, 0).toLight(0.9)).toEqual(Color.rgb(90, 0, 0))
    expect(Color.rgb(0, 0, 0).toString(1)).toBe('#000000ff')
    expect(Color.rgb(255, 255, 255).toString(0.5)).toBe('#ffffff7f')
  })
})

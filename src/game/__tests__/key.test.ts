import { describe, it, expect } from 'vitest'
import { Key } from '../Key'

describe('Key', () => {
  it('方向键与 directionId', () => {
    expect(new Key({ code: 'ArrowUp' }).isUp()).toBe(true)
    expect(new Key({ code: 'KeyW' }).isUp()).toBe(true)
    expect(new Key({ code: 'ArrowLeft' }).directionId()).toBe(3)
    expect(new Key({ code: 'KeyD' }).directionId()).toBe(1)
    expect(new Key({ code: 'ArrowUp' }).direction()).toEqual({ x: -1, y: 0 })
  })
  it('运算符键（含 shift 组合）', () => {
    expect(new Key({ code: 'NumpadAdd', shiftKey: false }).isAdd()).toBe(true)
    expect(new Key({ code: 'Equal', shiftKey: true }).isAdd()).toBe(true)
    expect(new Key({ code: 'Equal', shiftKey: false }).isEqual()).toBe(true)
    expect(new Key({ code: 'Slash', shiftKey: false }).isDiv()).toBe(true)
    expect(new Key({ code: 'Digit8', shiftKey: true }).isMul()).toBe(true)
    expect(new Key({ code: 'Enter', shiftKey: false }).isEnter()).toBe(true)
  })
})

import { describe, it, expect } from 'vitest'
import { arrowValue, BlockValue, chessValue, emptyValue, numValue, strValue } from '../BlockValue'

describe('BlockValue', () => {
  it('工厂与类型判定', () => {
    expect(numValue(3).isNum()).toBe(true)
    expect(strValue('ok').isStr()).toBe(true)
    expect(arrowValue(90).isArrow()).toBe(true)
    expect(chessValue('pawn').isChess()).toBe(true)
    expect(emptyValue().empty()).toBe(true)
    expect(new BlockValue(5).realText).toBe('5')
    expect(numValue(5.4).realText).toBe('5')
  })
  it('eq 比较类型与值', () => {
    expect(BlockValue.eq(numValue(1), numValue(1))).toBe(true)
    expect(BlockValue.eq(numValue(1), strValue('1'))).toBe(false)
    expect(BlockValue.eq(arrowValue(90), arrowValue(90))).toBe(true)
  })
})

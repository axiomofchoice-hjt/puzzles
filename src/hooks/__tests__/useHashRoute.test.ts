import { describe, it, expect } from 'vitest'
import { parseHash } from '../useHashRoute'

describe('parseHash', () => {
  it('解析', () => {
    expect(parseHash('')).toBe('')
    expect(parseHash('#home')).toBe('home')
    expect(parseHash('#12')).toBe('12')
    expect(parseHash('home')).toBe('')
  })
})

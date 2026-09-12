import Cookies from 'js-cookie'
import { genArray } from './tools'

const COOKIE_NAME = 'ok'

/** cookie 为 hex 位打包，低位在前：第 i 个 hex 字符的低位对应第 i*4 关。 */
export function decodeProgress(s: string | undefined, size: number): boolean[] {
  const ok = genArray(size, () => false)
  if (typeof s !== 'string') return ok
  for (let i = 0; i < s.length; i++) {
    const num = parseInt(s[s.length - i - 1]!, 16)
    for (let j = 0; j < 4; j++) {
      if (((num >> j) & 1) === 1) ok[i * 4 + j] = true
    }
  }
  return ok
}

/** `decodeProgress` 的逆运算：高位分组在前，去掉前导零。 */
export function encodeProgress(ok: readonly boolean[]): string {
  const nibbles: string[] = []
  for (let i = 0; i < ok.length; i += 4) {
    let nibble = 0
    for (let j = 0; j < 4; j++) {
      if (ok[i + j]) nibble |= 1 << j
    }
    nibbles.push(nibble.toString(16))
  }
  return nibbles.reverse().join('').replace(/^0+/, '')
}

export interface ProgressLike {
  get(id: number): boolean
  set(id: number): void
  clear(): void
  count(): number
}

export class Progress implements ProgressLike {
  private ok: boolean[]
  constructor(size: number) {
    this.ok = decodeProgress(Cookies.get(COOKIE_NAME), size)
  }
  get(id: number): boolean {
    return this.ok[id] ?? false
  }
  set(id: number): void {
    if (this.ok[id] === false) {
      this.ok[id] = true
      this.save()
    }
  }
  clear(): void {
    this.ok.fill(false)
    this.save()
  }
  count(): number {
    return this.ok.filter(Boolean).length
  }
  private save(): void {
    Cookies.set(COOKIE_NAME, encodeProgress(this.ok), {
      secure: true,
      expires: new Date(9999, 12, 31),
      path: '/',
    })
  }
}

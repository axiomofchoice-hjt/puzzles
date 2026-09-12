function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

/**
 * 关卡 L4（24 点）用的分数：`f` 为符号，数值为 `f * u / d`。
 * `u === 0 && d === 0` 表示"不是一个数"（★），`d === 0` 表示 ±∞。
 */
export class Frac {
  f: number
  u: number
  d: number
  constructor(u: number, d: number, f: number) {
    this.u = u
    this.d = d
    this.f = f
    this.normalize()
  }
  private normalize(): void {
    this.f *= (this.u < 0) !== (this.d < 0) ? -1 : 1
    this.u = Math.abs(this.u)
    this.d = Math.abs(this.d)
    if (this.u === 0 && this.d === 0) return
    if (this.u === 0) this.d = 1
    if (this.d === 0) this.u = 1
    const x = gcd(this.u, this.d)
    this.u /= x
    this.d /= x
  }
  static add(a: Frac, b: Frac): Frac {
    return new Frac(a.f * a.u * b.d + b.f * b.u * a.d, a.d * b.d, 1)
  }
  static sub(a: Frac, b: Frac): Frac {
    return new Frac(a.f * a.u * b.d - b.f * b.u * a.d, a.d * b.d, 1)
  }
  static mul(a: Frac, b: Frac): Frac {
    return new Frac(a.u * b.u, a.d * b.d, a.f * b.f)
  }
  static div(a: Frac, b: Frac): Frac {
    return new Frac(a.u * b.d, a.d * b.u, a.f * b.f)
  }
  /** 返回 a - b 的符号（分子形式）。 */
  static compare(a: Frac, b: Frac): number {
    return a.u * a.f * b.d - b.u * b.f * a.d
  }
  toString(): string {
    if (this.u === 0 && this.d === 0) return '★'
    if (this.d === 0) return (this.f === 1 ? '+' : '-') + '∞'
    let res = this.f === -1 ? '-' : ''
    res += this.u.toString()
    if (this.d !== 1) res += '/' + this.d.toString()
    return res
  }
}

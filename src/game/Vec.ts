export class Vec {
  constructor(
    readonly x: number,
    readonly y: number,
  ) {}
  static add(v1: Vec, v2: Vec): Vec {
    return new Vec(v1.x + v2.x, v1.y + v2.y)
  }
  static sub(v1: Vec, v2: Vec): Vec {
    return new Vec(v1.x - v2.x, v1.y - v2.y)
  }
  static mul(v: Vec, k: number): Vec {
    return new Vec(v.x * k, v.y * k)
  }
  static equal(v1: Vec, v2: Vec): boolean {
    return v1.x === v2.x && v1.y === v2.y
  }
  sum(): number {
    return Math.abs(this.x) + Math.abs(this.y)
  }
  max(): number {
    return Math.max(this.x, this.y)
  }
  min(): number {
    return Math.min(this.x, this.y)
  }
}

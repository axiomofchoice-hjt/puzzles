export class Color {
  constructor(
    readonly r: number,
    readonly g: number,
    readonly b: number,
  ) {}
  static rgb(r: number, g: number, b: number): Color {
    return new Color(r, g, b)
  }
  get isLight(): boolean {
    return this.r + this.g + this.b !== 255 * 3
  }
  toDark(k: number): Color {
    return new Color(
      Math.floor(255 - (255 - this.r) * k),
      Math.floor(255 - (255 - this.g) * k),
      Math.floor(255 - (255 - this.b) * k),
    )
  }
  toLight(k: number): Color {
    return new Color(Math.floor(this.r * k), Math.floor(this.g * k), Math.floor(this.b * k))
  }
  /** `#rrggbbaa`，`a` 为 0~1 的透明度 */
  toString(a: number): string {
    const toHex = (x: number) => (256 + Math.round(x)).toString(16).slice(1)
    return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}${toHex(Math.floor(a * 255.9))}`
  }
  equal(other: Color): boolean {
    return this.r === other.r && this.g === other.g && this.b === other.b
  }
  static readonly white = Color.rgb(255, 255, 255)
  static readonly black = Color.rgb(0, 0, 0)
  static readonly grey = Color.rgb(211, 211, 211)
  static readonly blue = Color.rgb(0, 191, 255)
  static readonly red = Color.rgb(255, 99, 71)
  static readonly yellow = Color.rgb(255, 215, 0)
  static readonly green = Color.rgb(120, 190, 33)
  static readonly purple = Color.rgb(221, 51, 221)
}

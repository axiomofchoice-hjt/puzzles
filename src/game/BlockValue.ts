import { assert } from './tools'

/** 方块上显示的值：数字 / 文本 / 箭头 / 星星 / 棋子。不可变值对象。 */
export class BlockValue {
  static readonly Str = Symbol('Str')
  static readonly Num = Symbol('Num')
  static readonly Arrow = Symbol('Arrow')
  static readonly Star = Symbol('Star')
  static readonly Chess = Symbol('Chess')
  readonly type: symbol
  readonly value: string | number
  constructor(arg?: string | number | symbol, value?: string | number) {
    if (typeof arg === 'symbol') {
      assert(
        (arg === BlockValue.Str && typeof value === 'string') ||
          (arg === BlockValue.Num && typeof value === 'number') ||
          (arg === BlockValue.Arrow && typeof value === 'number') ||
          arg === BlockValue.Star ||
          (arg === BlockValue.Chess && typeof value === 'string'),
      )
      this.type = arg
      this.value = value as string | number
    } else if (typeof arg === 'number') {
      assert(typeof value === 'undefined')
      this.type = BlockValue.Num
      this.value = arg
    } else {
      assert(typeof value === 'undefined')
      this.type = BlockValue.Str
      this.value = arg ?? ''
    }
  }
  isNum(): boolean {
    return this.type === BlockValue.Num
  }
  isStr(): boolean {
    return this.type === BlockValue.Str
  }
  isArrow(): boolean {
    return this.type === BlockValue.Arrow
  }
  isStar(): boolean {
    return this.type === BlockValue.Star
  }
  isChess(): boolean {
    return this.type === BlockValue.Chess
  }
  get str(): string {
    return this.value as string
  }
  get num(): number {
    return this.value as number
  }
  get realText(): string {
    return this.isNum() ? String(Math.round(this.num)) : this.isStr() ? this.str : ''
  }
  empty(): boolean {
    return this.isStr() && this.value === ''
  }
  static eq(a: BlockValue, b: BlockValue): boolean {
    return a.type === b.type && a.value === b.value
  }
}

export const emptyValue = (): BlockValue => new BlockValue()
export const strValue = (s: string): BlockValue => new BlockValue(s)
export const numValue = (n: number): BlockValue => new BlockValue(n)
export const arrowValue = (deg: number): BlockValue => new BlockValue(BlockValue.Arrow, deg)
export const starValue = (): BlockValue => new BlockValue(BlockValue.Star)
export const chessValue = (name: string): BlockValue => new BlockValue(BlockValue.Chess, name)

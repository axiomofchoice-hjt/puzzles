import { Vec } from './Vec'

export class Key {
  readonly code: string
  readonly shiftKey: boolean
  constructor({
    code,
    shiftKey = false,
  }: Pick<KeyboardEvent, 'code'> & Partial<Pick<KeyboardEvent, 'shiftKey'>>) {
    this.code = code
    this.shiftKey = shiftKey
  }
  isAdd(): boolean {
    return this.code === 'NumpadAdd' || (this.code === 'Equal' && this.shiftKey)
  }
  isSub(): boolean {
    return this.code === 'NumpadSubtract' || (this.code === 'Minus' && !this.shiftKey)
  }
  isMul(): boolean {
    return this.code === 'NumpadMultiply' || (this.code === 'Digit8' && this.shiftKey)
  }
  isDiv(): boolean {
    return this.code === 'NumpadDivide' || (this.code === 'Slash' && !this.shiftKey)
  }
  isEnter(): boolean {
    return this.code === 'Enter' || this.code === 'NumpadEnter'
  }
  isEqual(): boolean {
    return this.code === 'Equal' && !this.shiftKey
  }
  isUp(): boolean {
    return this.code === 'KeyW' || this.code === 'ArrowUp'
  }
  isDown(): boolean {
    return this.code === 'KeyS' || this.code === 'ArrowDown'
  }
  isLeft(): boolean {
    return this.code === 'KeyA' || this.code === 'ArrowLeft'
  }
  isRight(): boolean {
    return this.code === 'KeyD' || this.code === 'ArrowRight'
  }
  isDirection(): boolean {
    return this.isUp() || this.isDown() || this.isLeft() || this.isRight()
  }
  direction(): Vec {
    return this.isUp()
      ? new Vec(-1, 0)
      : this.isDown()
        ? new Vec(1, 0)
        : this.isLeft()
          ? new Vec(0, -1)
          : new Vec(0, 1)
  }
  directionId(): number {
    return this.isUp() ? 0 : this.isRight() ? 1 : this.isDown() ? 2 : 3
  }
}

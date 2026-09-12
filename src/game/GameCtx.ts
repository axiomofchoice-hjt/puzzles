import { Vec } from './Vec'
import { Task } from './Task'
import type { ProgressLike } from './progress'
import { makeBlock } from '@/store/types'
import type { Block, BlockInit, GameDraft } from '@/store/types'
import { inRange } from './tools'

export type TaskSpec = [now: number, max: number, check: (now: number, max: number) => number]

export class GameCtx {
  readonly stageCount: number
  readonly progress: ProgressLike
  constructor(
    private readonly draft: GameDraft,
    readonly n: number,
    readonly m: number,
    stageCount: number,
    progress: ProgressLike,
  ) {
    this.stageCount = stageCount
    this.progress = progress
  }
  get size(): number {
    return this.n * this.m
  }
  get blocks() {
    return this.draft.blocks
  }
  get lines() {
    return this.draft.lines
  }
  get header() {
    return this.draft.header
  }
  get tasks() {
    return this.draft.tasks
  }
  get buttons() {
    return this.draft.buttons
  }
  get(x: number | Vec, y?: number): Block {
    return this.draft.blocks[this.getId(x, y)]!
  }
  getId(x: number | Vec, y?: number): number {
    if (x instanceof Vec) return x.x * this.m + x.y
    if (typeof y === 'number') return x * this.m + y
    return x
  }
  getXY(id: number): [number, number] {
    return [Math.floor(id / this.m), id % this.m]
  }
  getVec(id: number): Vec {
    return new Vec(Math.floor(id / this.m), id % this.m)
  }
  inArea(x: number | Vec, y?: number): boolean {
    const v = x instanceof Vec ? x : new Vec(x, y!)
    return inRange(v.x, 0, this.n) && inRange(v.y, 0, this.m)
  }
  addBlock(init?: BlockInit): Block {
    const block = makeBlock(this.draft.blocks.length, init)
    this.draft.blocks.push(block)
    return block
  }
  showBonus(content: string): void {
    this.draft.bonus.content = content
    this.draft.bonus.show = true
  }
  setTip(content: string): void {
    this.draft.buttons.tip.show = true
    this.draft.buttons.tipContent = content
  }
  setTasks(specs: TaskSpec[]): void {
    this.draft.tasks = specs.map(([now, max, check]) => new Task(now, max, check))
  }
}

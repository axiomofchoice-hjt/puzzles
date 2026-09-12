import type { GameCtx, TaskSpec } from './GameCtx'
import type { Key } from './Key'

export interface Level<S = unknown> {
  n: number | ((stageCount: number) => number)
  m: number
  noBlock?: boolean
  blockInnerSize?: number
  headerMessage?: string
  tip?: string
  hideBack?: boolean
  tasks?: TaskSpec[]
  init(game: GameCtx): S
  click?(state: S, id: number, game: GameCtx): void
  key?(state: S, key: Key, game: GameCtx): void
}

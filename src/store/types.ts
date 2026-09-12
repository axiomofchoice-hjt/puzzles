import { BlockValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import { CONFIG } from '@/game/Config'
import { Line } from '@/game/Line'
import { Task } from '@/game/Task'
import { Vec } from '@/game/Vec'

export interface Block {
  id: number
  size: number
  pos: Vec
  value: BlockValue
  color: Color
  background: Color
  rotate: number
  clickable: boolean
  opacity: number
  round: boolean
  backgroundOpacity: number
  immediate: BlockValue | null
}

export type BlockInit = Partial<Omit<Block, 'id' | 'immediate'>>

export function makeBlock(id: number, init?: BlockInit): Block {
  return {
    id,
    size: init?.size ?? CONFIG.blockSize - CONFIG.blockGap,
    pos: init?.pos ?? new Vec(0, 0),
    value: init?.value ?? new BlockValue(),
    color: init?.color ?? Color.black,
    background: init?.background ?? Color.black,
    rotate: init?.rotate ?? 0,
    clickable: init?.clickable ?? false,
    opacity: init?.opacity ?? 1,
    round: init?.round ?? false,
    backgroundOpacity: init?.backgroundOpacity ?? 1,
    immediate: null,
  }
}

export interface HeaderState {
  level: number | null
  message: string
}

export interface ButtonsState {
  back: { show: boolean }
  restart: { show: boolean }
  tip: { show: boolean }
  tipContent: string
}

export interface BonusState {
  content: string
  show: boolean
}

export interface GameState {
  route: string
  stage: unknown
  blocks: Block[]
  lines: Line[]
  header: HeaderState
  tasks: Task[]
  buttons: ButtonsState
  bonus: BonusState
  pressSpace: boolean
  stageWidth: number
  stageHeight: number
  loadSeq: number
}

export type GameDraft = GameState

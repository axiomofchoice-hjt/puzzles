import { createStore, type StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { enableMapSet } from 'immer'
import { GameCtx } from '@/game/GameCtx'
import { CONFIG } from '@/game/Config'
import { Key } from '@/game/Key'
import type { Level } from '@/game/level'
import { Progress, type ProgressLike } from '@/game/progress'
import { Task } from '@/game/Task'
import { Vec } from '@/game/Vec'
import { LEVELS } from '@/stages'
import Home from '@/stages/Home'
import { makeBlock } from './types'
import type { GameState } from './types'

// L11 的 stage 状态含 Map（btn），immer 需要显式启用 Map/Set 插件后才能 draft。
enableMapSet()

export type GameStore = GameState & {
  loadRoute: (path: string) => void
  blockClick: (id: number) => void
  keyDown: (e: KeyboardEvent) => void
  keyUp: (e: KeyboardEvent) => void
  restart: () => void
  hideBonus: () => void
}

export type GameStoreApi = StoreApi<GameStore>

const emptyState = (): GameState => ({
  route: '',
  stage: null,
  blocks: [],
  lines: [],
  header: { level: null, message: '' },
  tasks: [],
  buttons: { back: { show: true }, restart: { show: true }, tip: { show: false }, tipContent: '' },
  bonus: { content: '', show: false },
  pressSpace: false,
  stageWidth: 0,
  stageHeight: 0,
  loadSeq: 0,
})

function levelN(level: Level<never>, stageCount: number): number {
  return typeof level.n === 'function' ? level.n(stageCount) : level.n
}

export function createGameStore(
  levels: Level<never>[] = LEVELS,
  progress: ProgressLike = new Progress(levels.length),
): GameStoreApi {
  let currentLevel: Level<never> | null = null

  const updateProgress = (s: GameState) => {
    if (s.route !== 'home' && s.tasks.length > 0 && s.tasks.every((t) => t.ok())) {
      progress.set(+s.route - 1)
    }
  }

  const run = (
    set: (fn: (draft: GameState) => void) => void,
    fn: (level: Level<never>, game: GameCtx, draft: GameState) => void,
  ) => {
    const level = currentLevel
    if (!level) return
    set((d) => {
      fn(level, new GameCtx(d, levelN(level, levels.length), level.m, levels.length, progress), d)
    })
  }

  return createStore<GameStore>()(
    immer((set, get) => ({
      ...emptyState(),

      loadRoute: (path) => {
        const level = path === 'home' ? (Home as Level<never>) : levels[+path - 1]
        if (!level) {
          currentLevel = null
          set((d) => {
            Object.assign(d, emptyState(), { route: path, loadSeq: d.loadSeq + 1 })
          })
          return
        }
        currentLevel = level
        const n = levelN(level, levels.length)
        const m = level.m
        set((d) => {
          Object.assign(d, emptyState(), {
            route: path,
            loadSeq: d.loadSeq + 1,
            header: { level: path === 'home' ? null : +path, message: level.headerMessage ?? '' },
            buttons: {
              back: { show: level.hideBack !== true },
              restart: { show: true },
              tip: { show: level.tip !== undefined },
              tipContent: level.tip ?? '',
            },
            stageWidth: CONFIG.blockSize * m + CONFIG.blockGap,
            stageHeight: CONFIG.blockSize * n + CONFIG.blockGap,
          })
          if (!level.noBlock) {
            for (let i = 0; i < n * m; i++) {
              d.blocks.push(
                makeBlock(i, {
                  size: level.blockInnerSize,
                  pos: new Vec(Math.floor(i / m), i % m),
                }),
              )
            }
          }
          if (level.tasks !== undefined) {
            d.tasks = level.tasks.map(([now, max, check]) => new Task(now, max, check))
          }
          d.stage = level.init(new GameCtx(d, n, m, levels.length, progress))
        })
      },

      blockClick: (id) => {
        const { route } = get()
        if (route === 'home') {
          window.location.hash = String(id + 1)
          return
        }
        run(set, (level, game, d) => level.click?.(d.stage as never, id, game))
        updateProgress(get())
      },

      keyDown: (e) => {
        if (e.code === 'KeyR' && get().route !== 'home') get().restart()
        if (e.code === 'Escape' || e.code === 'Backspace') window.location.hash = 'home'
        if (e.code === 'Space') set((d) => void (d.pressSpace = true))
        run(set, (level, game, d) => level.key?.(d.stage as never, new Key(e), game))
        updateProgress(get())
      },

      keyUp: (e) => {
        if (e.code === 'Space') set((d) => void (d.pressSpace = false))
      },

      restart: () => {
        const route = get().route
        if (route === 'home') {
          if (window.confirm('清除所有记录？')) {
            progress.clear()
            get().loadRoute('home')
          }
        } else {
          get().loadRoute(route)
        }
      },

      hideBonus: () => set((d) => void (d.bonus.show = false)),
    })),
  )
}

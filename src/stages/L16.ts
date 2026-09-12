import { fillBoard } from '@/game/board'
import { arrowValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import { drawGridRect } from '@/game/Line'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { genArray, range } from '@/game/tools'
import { Vec } from '@/game/Vec'

type Composition = {
  from: [number, number, number]
  to: [number, number, number]
  score: number
}

const COMPOSITION: Composition[] = [
  { from: [0, 0, -1], to: [1, 1, 1], score: 0 },
  { from: [0, 1, -1], to: [2, 2, -1], score: 0 },
  { from: [1, 2, -1], to: [0, 0, 1], score: 0 },
  { from: [2, 2, -1], to: [-1, -1, -1], score: 1 },
  { from: [2, 2, 2], to: [2, 2, -1], score: 1 },
]

interface L16State {
  tag: number[]
}

const getSize = (s: L16State, l: number, r: number) => {
  let res = 0
  for (let i = l; i <= r; i++) {
    if (s.tag[i] !== -1) res++
  }
  return res
}

const leftSize = (s: L16State) => getSize(s, 0, 2)
const rightSize = (s: L16State) => getSize(s, 4, 6)
const bagSize = (s: L16State, game: GameCtx) => getSize(s, 7, game.size - 1)

/** 左侧三格是否与某个配方匹配。 */
const matches = (comp: Composition, tag: number[]): boolean =>
  comp.from.every((v, i) => v === tag[i])

/** 在 [start, start+len) 这段升序 tag 里，找出 `tag[id]` 应插入的位置。 */
function insertPos(s: L16State, id: number, start: number, len: number): number {
  let pos = len
  while (pos > 0 && s.tag[start + pos - 1]! > s.tag[id]!) pos--
  return pos
}

const swap = (s: L16State, game: GameCtx, id1: number, id2: number) => {
  game.get(id1).pos = game.getVec(id2)
  game.get(id2).pos = game.getVec(id1)
  ;[game.blocks[id1], game.blocks[id2]] = [game.blocks[id2], game.blocks[id1]]
  ;[s.tag[id1], s.tag[id2]] = [s.tag[id2], s.tag[id1]]
}

const move = (s: L16State, game: GameCtx, from: number, to: number) => {
  if (from < to) {
    for (let i = from; i <= to - 1; i++) swap(s, game, i, i + 1)
  } else if (from > to) {
    for (let i = from; i >= to + 1; i--) swap(s, game, i, i - 1)
  }
}

const L16: Level<L16State> = {
  n: 4,
  m: 7,
  headerMessage: '化学',
  tasks: [[0, 4, Task.ge]],
  init(game) {
    const s: L16State = {
      tag: genArray(game.size, () => -1),
    }
    fillBoard(game, { clickable: true, opacity: 0 })
    game.get(0, 3).value = arrowValue(90)
    game.get(0, 3).background = Color.yellow
    const line = { width: 2, color: Color.blue }
    drawGridRect(game.lines, new Vec(0, 0), new Vec(1, 3), line)
    drawGridRect(game.lines, new Vec(0, 4), new Vec(1, 7), line)
    for (const i of range(3)) {
      s.tag[i + 7] = 0
      game.get(1, i).opacity = 1
      game.get(1, i).background = Color.green
    }
    return s
  },
  click(s, id, game) {
    id = range(game.size).findIndex((x) => game.get(x).id === id)
    // 左/右工作台 → 背包：按 tag 大小插入有序背包
    if (id >= 0 && id < leftSize(s) && bagSize(s, game) < 21) {
      const pos = insertPos(s, id, 7, bagSize(s, game))
      move(s, game, bagSize(s, game) + 7, pos + 7)
      swap(s, game, pos + 7, id)
      move(s, game, id, leftSize(s))
    }
    if (id >= 4 && id - 4 < rightSize(s) && bagSize(s, game) < 21) {
      const pos = insertPos(s, id, 7, bagSize(s, game))
      move(s, game, bagSize(s, game) + 7, pos + 7)
      swap(s, game, pos + 7, id)
      move(s, game, id, rightSize(s) + 4)
    }
    // 背包 → 左工作台
    if (id >= 7 && id - 7 < bagSize(s, game) && leftSize(s) < 3) {
      const pos = insertPos(s, id, 0, leftSize(s))
      move(s, game, leftSize(s), pos)
      swap(s, game, pos, id)
      move(s, game, id, bagSize(s, game) + 7)
    }

    for (const comp of COMPOSITION) {
      if (!matches(comp, s.tag)) continue
      for (const i of range(3)) {
        if (comp.to[i] !== -1) {
          game.get(i + 4).background = [Color.green, Color.purple, Color.red][comp.to[i]]
        }
      }
    }
    if (id === 3 && rightSize(s) === 0) {
      for (const comp of COMPOSITION) {
        if (!matches(comp, s.tag)) continue
        for (const i of range(3)) {
          s.tag[i] = -1
          game.get(i).opacity = 0
          if (comp.to[i] !== -1) {
            s.tag[i + 4] = comp.to[i]
            game.get(i + 4).opacity = 1
          }
        }
        game.tasks[0].add(comp.score)
      }
    }
    const reacted = rightSize(s) === 0 && COMPOSITION.some((comp) => matches(comp, s.tag))
    game.get(3).opacity = +reacted
  },
}

export default L16

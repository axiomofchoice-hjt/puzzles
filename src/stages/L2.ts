import { fillBoard, forEachBlock } from '@/game/board'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { countRange, genArray } from '@/game/tools'

const SHAPE: [number, number][][] = [
  [
    [-1, 0],
    [0, -1],
    [0, 1],
  ],
  [
    [-1, 0],
    [0, 0],
    [0, 1],
  ],
  [
    [0, -1],
    [0, 0],
    [0, 1],
  ],
]

interface L2State {
  tag: boolean[]
  shapeId: number
}

function checkOneBlock(s: L2State, game: GameCtx, x: number, y: number): boolean {
  return game.inArea(x, y) && !s.tag[game.getId(x, y)]
}

function checkShape(s: L2State, game: GameCtx, x: number, y: number, shape: [number, number][]): boolean {
  return shape.every((pos) => checkOneBlock(s, game, x + pos[0], y + pos[1]))
}

function updateClickable(s: L2State, game: GameCtx): void {
  forEachBlock(game, (block, id) => {
    const { x, y } = game.getVec(id)
    block.clickable = checkShape(s, game, x, y, SHAPE[s.shapeId]!)
  })
}

const L2: Level<L2State> = {
  n: 6,
  m: 6,
  headerMessage: '地砖',
  tasks: [
    [0, 3, Task.eq],
    [0, 3, Task.eq],
    [0, 5, Task.eq],
  ],
  init(game) {
    const s: L2State = { tag: genArray(game.size, () => false), shapeId: 0 }
    fillBoard(game, { background: Color.grey })
    updateClickable(s, game)
    return s
  },
  click(s, id, game) {
    const { x, y } = game.getVec(id)
    if (!checkShape(s, game, x, y, SHAPE[s.shapeId]!)) return
    for (const [dx, dy] of SHAPE[s.shapeId]!) {
      game.get(game.getId(x + dx, y + dy)).background = [Color.green, Color.yellow, Color.blue][
        s.shapeId
      ]!
      s.tag[game.getId(x + dx, y + dy)] = true
    }
    game.tasks[s.shapeId].add(1)
    if (s.shapeId !== 2 && game.tasks[s.shapeId].ok()) {
      s.shapeId++
    }
    updateClickable(s, game)
    if (
      s.shapeId === 1 &&
      game.tasks[s.shapeId].now === 2 &&
      countRange(game.size, (i) => game.get(i).clickable) === 0
    ) {
      game.showBonus('只能放 5 个')
    }
  },
}

export default L2

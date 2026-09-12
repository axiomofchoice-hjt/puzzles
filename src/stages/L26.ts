import { fillBoard } from '@/game/board'
import { numValue, strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Key } from '@/game/Key'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { near4, range } from '@/game/tools'
import { Vec } from '@/game/Vec'

const OPS: ((a: number, b: number) => number)[] = [
  (a, b) => a / b,
  (a, b) => a + b,
  (a, b) => a * b,
  (a, b) => a - b,
]
const OP_SIGNS = ['÷', '+', '×', '-']

interface L26State {
  player: Vec
  num: number
}

const clickableDir = (s: L26State, dirId: number, game: GameCtx): boolean => {
  const op = OPS[dirId] as (a: number, b: number) => number
  const nextNum = op(s.num, 2)
  const nextVec = near4(s.player)[dirId] as Vec
  return !(dirId === 0 && s.num % 2 !== 0) && game.inArea(nextVec) && nextNum >= 0 && nextNum <= 4
}

const update = (s: L26State, game: GameCtx) => {
  fillBoard(game, { value: strValue(''), clickable: false })
  for (const dirId of range(OPS.length)) {
    if (clickableDir(s, dirId, game)) {
      const p = near4(s.player)[dirId] as Vec
      game.get(p).clickable = true
      game.get(p).value = strValue(OP_SIGNS[dirId] as string)
    }
  }
  game.get(game.size).value = numValue(s.num)
  game.get(game.size).pos = s.player
  game.tasks[0].set(+Vec.equal(s.player, new Vec(5, 5)))
  game.tasks[1].set(s.num)
}

const doClick = (s: L26State, id: number, game: GameCtx) => {
  const dirId = near4(s.player).findIndex((v) => Vec.equal(game.getVec(id), v))
  const op = OPS[dirId] as (a: number, b: number) => number
  s.num = op(s.num, 2)
  s.player = near4(s.player)[dirId] as Vec
  update(s, game)
}

const L26: Level<L26State> = {
  n: 6,
  m: 6,
  tip: '可以用方向键',
  headerMessage: '运算',
  tasks: [
    [0, 1, Task.eq],
    [0, 4, () => 1],
  ],
  init(game) {
    fillBoard(game, { background: Color.grey })
    game.get(5, 5).background = Color.yellow
    game.addBlock({
      background: Color.blue,
    })
    const s: L26State = {
      player: new Vec(0, 0),
      num: 1,
    }
    update(s, game)
    return s
  },
  click(s, id, game) {
    doClick(s, id, game)
  },
  key(s, key: Key, game) {
    if (key.isDirection() && clickableDir(s, key.directionId(), game)) {
      doClick(s, game.getId(near4(s.player)[key.directionId()] as Vec), game)
    }
  },
}

export default L26

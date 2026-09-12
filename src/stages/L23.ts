import { arrowValue, strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { count, near4, range } from '@/game/tools'
import { Vec } from '@/game/Vec'

const DIR_ID = [71, 83, 82, 81]
const RESULT = [19, 34, 47]

interface L23State {
  moves: number[]
}

const update = (s: L23State, game: GameCtx) => {
  for (const i of range(4)) {
    game.get(DIR_ID[i]!).background = s.moves.length < 5 ? Color.yellow : Color.grey
    game.get(DIR_ID[i]!).clickable = s.moves.length < 5
  }
  for (const i of range(66)) {
    game.get(i).background = Color.grey
  }
  let p = new Vec(5, 0)
  game.get(p).background = Color.blue
  for (let i = 0; i < 20 * s.moves.length; i++) {
    p = near4(p)[s.moves[i % s.moves.length]!]!
    if (game.inArea(p) && p.x < 6) {
      game.get(p).background = Color.blue
    }
  }
  game.tasks[0].set(count(RESULT, (x) => game.get(x).background.b === 255))
}

const doClick = (s: L23State, id: number, game: GameCtx): void => {
  id = DIR_ID.findIndex((x) => x === id)
  s.moves.push(id)
  game.tasks[1].add(1)
  update(s, game)
}

const L23: Level<L23State> = {
  n: 8,
  m: 11,
  headerMessage: '指令循环',
  tip: '可以用方向键',
  tasks: [
    [0, 3, Task.eq],
    [0, 5, Task.le],
  ],
  init(game) {
    const s: L23State = { moves: [] }
    for (let i = 66; i < game.size; i++) {
      game.get(i).background = Color.white
    }
    for (const i of range(4)) {
      game.get(DIR_ID[i]!).value = arrowValue(i * 90)
    }
    for (const i of RESULT) {
      game.get(i).value = strValue('+')
    }
    update(s, game)
    return s
  },
  click: doClick,
  key(s, key, game) {
    if (s.moves.length < 5) {
      if (key.isDirection()) {
        doClick(s, DIR_ID[key.directionId()]!, game)
      }
    }
  },
}

export default L23

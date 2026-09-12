import { arrowValue, strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import { drawGridLine } from '@/game/Line'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { countRange, genArray, range } from '@/game/tools'
import { Vec } from '@/game/Vec'

const RESULT = [8, 5, 7, 5, 8]

interface L22State {
  pos: number[]
  locked: boolean[]
}

const update = (s: L22State, game: GameCtx) => {
  for (const i of range(5)) {
    if (s.pos[i]! < game.m) {
      game.get(game.size + i).pos = new Vec(i, s.pos[i]!)
      game.get(game.size + i).clickable = s.pos[i]! < 5
      game.get(game.size + i).opacity = 1
      game.get(game.size + i).value = strValue(s.locked[i] ? '/' : '')
      game.get(i, s.pos[i]!).opacity = 0
    } else {
      game.get(game.size + i).opacity = 0
    }
  }
  game.tasks[0].set(countRange(5, (i) => s.pos[i] === RESULT[i]))
}

const doClick = (s: L22State, id: number, game: GameCtx): void => {
  if (id >= game.size) {
    s.locked[id - game.size] = !s.locked[id - game.size]
  }
  for (const i of range(5)) {
    if (!s.locked[i]) {
      s.pos[i]!++
    }
  }
  update(s, game)
}

const L22: Level<L22State> = {
  n: 6,
  m: 9,
  headerMessage: '赛车',
  tasks: [[0, 5, Task.eq]],
  init(game) {
    const s: L22State = {
      pos: genArray(5, () => 0),
      locked: genArray(5, () => false),
    }
    for (const i of range(game.size - game.m)) {
      game.get(i).background = Color.grey
    }
    for (const i of range(game.m)) {
      game.get(5, i).opacity = 0
    }
    for (const i of range(5)) {
      game.get(i, RESULT[i]!).value = strValue('+')
    }
    game.get(5, 4).opacity = 1
    game.get(5, 4).clickable = true
    game.get(5, 4).background = Color.blue
    game.get(5, 4).value = arrowValue(90)
    drawGridLine(game.lines, new Vec(0, 5), new Vec(5, 5), { width: 2, color: Color.red })
    for (let k = 0; k < 5; k++) {
      game.addBlock({
        background: Color.yellow,
      })
    }
    update(s, game)
    return s
  },
  click: doClick,
  key(s, key, game) {
    if (key.isRight()) {
      doClick(s, game.getId(5, 4), game)
    }
  },
}

export default L22

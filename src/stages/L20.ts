import { fillBoard, nearIds } from '@/game/board'
import { strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { countRange, genArray } from '@/game/tools'

const RESULT = [
  0, 0, 0, 1, 0, 0,
  0, 0, 1, 1, 0, 0,
  1, 1, 1, 1, 1, 0,
  0, 1, 1, 1, 1, 1,
  0, 0, 1, 1, 0, 0,
  0, 0, 1, 0, 0, 0,
]

interface L20State {
  tag: number[]
}

function update(s: L20State, game: GameCtx): void {
  fillBoard(game, (i) => ({ background: s.tag[i] ? Color.blue : Color.grey }))
  game.tasks[0].set(countRange(game.size, (i) => s.tag[i] === RESULT[i]))
  if (game.tasks[0].now === 0) {
    game.showBonus('反向刷子')
  }
}

const L20: Level<L20State> = {
  n: 6,
  m: 6,
  headerMessage: '刷子',
  tasks: [[0, 36, Task.eq]],
  init(game) {
    const s: L20State = { tag: genArray(game.size, () => 0) }
    fillBoard(game, (i) => ({
      clickable: true,
      background: Color.grey,
      value: strValue(RESULT[i] ? '+' : ''),
    }))
    update(s, game)
    return s
  },
  click(s, id, game) {
    const t = s.tag[id]! ^ 1
    s.tag[id] = t
    for (const p of nearIds(game, game.getVec(id), { diagonal: true })) {
      s.tag[p] = t
    }
    update(s, game)
  },
}

export default L20

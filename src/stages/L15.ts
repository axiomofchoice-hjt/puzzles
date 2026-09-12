import { fillBoard } from '@/game/board'
import { numValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { countRange, genArray, range, shuffle } from '@/game/tools'
import { Vec } from '@/game/Vec'

interface L15State {
  tag: number[]
}

const update = (s: L15State, game: GameCtx) => {
  for (const i of range(game.size)) {
    game.get(s.tag[i]!).pos = new Vec(0, i)
    game.tasks[i].set(+(s.tag[i] === i))
  }
}

const L15: Level<L15State> = {
  n: 1,
  m: 7,
  headerMessage: '交换',
  tasks: genArray(7, () => [0, 1, Task.eq]),
  init(game) {
    const s: L15State = {
      tag: [0, 1, 2, 3, 4, 5, 6],
    }

    // 洗牌直到没有相邻的连续编号
    while (countRange(game.size - 1, (i) => Math.abs(s.tag[i]! - s.tag[i + 1]!) === 1)) {
      s.tag = shuffle(s.tag)
    }

    fillBoard(game, (id) => ({ clickable: true, background: Color.grey, value: numValue(id + 1) }))
    update(s, game)
    return s
  },
  click(s, id, game) {
    const pos = s.tag.findIndex((x) => x === id)
    s.tag = s.tag.slice(pos + 1).concat(s.tag.slice(pos, pos + 1).concat(s.tag.slice(0, pos)))
    update(s, game)
  },
}

export default L15

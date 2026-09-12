import { box9Ids, fillBoard } from '@/game/board'
import { strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { genArray } from '@/game/tools'

interface L9State {
  tag: number[]
}

const L9: Level<L9State> = {
  n: 3,
  m: 4,
  headerMessage: '点灯',
  tasks: [
    [0, 12, Task.eq],
  ],
  init(game) {
    fillBoard(game, (id) => {
      const [x, y] = game.getXY(id)
      return { value: strValue((x + y) % 2 !== 0 ? '+' : '-'), clickable: true, background: Color.yellow }
    })
    return { tag: genArray(game.size, () => 2) }
  },
  click(s, id, game) {
    const { x, y } = game.getVec(id)
    game.tasks[0].add(1)

    s.tag[id] = 0
    game.get(id).clickable = false
    game.get(id).opacity = 0

    const spread = (x + y) % 2 !== 0
    for (const ptr of box9Ids(game, game.getVec(id))) {
      if (s.tag[ptr] === 0) continue
      s.tag[ptr] = spread ? 2 : 1
      game.get(ptr).background = spread ? Color.yellow : Color.grey
      game.get(ptr).clickable = spread
    }
  },
}

export default L9

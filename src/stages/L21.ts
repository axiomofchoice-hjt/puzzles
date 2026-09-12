import { fillBoard } from '@/game/board'
import { numValue, strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { random } from '@/game/tools'
import { Vec } from '@/game/Vec'

interface L21State {
  t1: number
  t2: number
}

const L21: Level<L21State> = {
  n: 7,
  m: 11,
  headerMessage: '寻宝',
  tasks: [
    [0, 2, Task.eq],
    [0, 12, Task.leIncreasing],
  ],
  init(game) {
    fillBoard(game, { clickable: true, background: Color.grey })
    const s: L21State = {
      t1: random(game.size),
      t2: random(game.size),
    }
    while (Vec.sub(game.getVec(s.t1), game.getVec(s.t2)).min() <= 3) {
      s.t1 = random(game.size)
      s.t2 = random(game.size)
    }
    return s
  },
  click(s, id, game) {
    game.get(id).clickable = false
    game.tasks[1].add(1)
    if (id == s.t1 || id == s.t2) {
      game.get(id).background = Color.yellow
      game.get(id).value = strValue('★')
      game.tasks[0].add(1)
    } else {
      game.get(id).background = Color.green
      game.get(id).value = numValue(
        Vec.sub(game.getVec(s.t1), game.getVec(id)).sum() +
          Vec.sub(game.getVec(s.t2), game.getVec(id)).sum(),
      )
    }
  },
}

export default L21

import { box9Ids, crossIds, fillBoard } from '@/game/board'
import { Color } from '@/game/Color'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { count, genArray } from '@/game/tools'

interface L1State {
  tag: number[]
}

const L1: Level<L1State> = {
  n: 4,
  m: 5,
  headerMessage: '填充',
  tip: '点击蓝色方块会发生什么？',
  tasks: [
    [0, 20, Task.ge],
    [0, 3, Task.leIncreasing],
  ],
  init(game) {
    fillBoard(game, { clickable: true, background: Color.grey })
    return { tag: genArray(game.size, () => 0) }
  },
  click(s, id, game) {
    const v = game.getVec(id)
    game.tasks[1].add(1)
    const tag = s.tag[id]!
    if (tag === 0) {
      for (const p of crossIds(game, v)) {
        game.get(p).background = Color.blue
        game.get(p).clickable = true
        s.tag[p] = 1
      }
    } else if (tag === 1) {
      for (const p of box9Ids(game, v)) {
        game.get(p).background = Color.yellow
        game.get(p).clickable = false
        s.tag[p] = 2
      }
    }
    game.tasks[0].set(count(s.tag, (t) => t !== 0))
  },
}

export default L1

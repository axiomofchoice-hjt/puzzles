import { forEachBlock, nearIds } from '@/game/board'
import { numValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { count } from '@/game/tools'

const INIT_TAG = [
  -1, -1, 2, -1, -1, -1,
  2, 2, 2, 2, 2, 2,
  -1, 2, 2, -1, 2, 2,
  -1, -1, 2, -1, -1, -1,
]

interface L17State {
  tag: number[]
}

function update(s: L17State, game: GameCtx): void {
  forEachBlock(game, (block, i) => {
    if (s.tag[i] === -1) {
      block.opacity = 0
      return
    }
    const settled = s.tag[i] === 0
    block.background = settled ? Color.grey : Color.yellow
    block.value = numValue(s.tag[i]!)
    block.clickable = !settled
  })
  game.tasks[0].set(count(s.tag, (x) => x === 0))
}

const L17: Level<L17State> = {
  n: 4,
  m: 6,
  headerMessage: '水滴',
  tasks: [[0, 12, Task.eq]],
  init(game) {
    const s: L17State = { tag: [...INIT_TAG] }
    update(s, game)
    return s
  },
  click(s, id, game) {
    if (s.tag[id] === 1) {
      s.tag[id] = 2
    } else if (s.tag[id] === 4) {
      s.tag[id] = 0
    } else {
      s.tag[id] = 0
      for (const p of nearIds(game, game.getVec(id))) {
        if (s.tag[p] !== -1) {
          s.tag[p] = Math.min(4, s.tag[p]! + 1)
        }
      }
    }
    update(s, game)
  },
}

export default L17

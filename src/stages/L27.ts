import { fillBoard, forEachBlock } from '@/game/board'
import { starValue, strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import { CONFIG } from '@/game/Config'
import type { GameCtx } from '@/game/GameCtx'
import type { Level } from '@/game/level'
import { drawGridRect } from '@/game/Line'
import { Task } from '@/game/Task'
import { count, genArray, near8, range } from '@/game/tools'
import { Vec } from '@/game/Vec'

const AREA = [
  0, 0, 1, 2, 2, 2,
  0, 0, 1, 2, 3, 2,
  0, 0, 3, 3, 3, 2,
  4, 0, 3, 3, 2, 2,
  4, 0, 3, 3, 2, 5,
  4, 4, 4, 3, 3, 5,
]

const LINES = [
  [0, 0, 6, 0], [0, 0, 0, 6], [0, 6, 6, 6], [6, 0, 6, 6],
  [3, 0, 3, 1], [3, 1, 5, 1], [5, 1, 5, 3], [5, 3, 6, 3],
  [0, 2, 5, 2], [2, 2, 2, 4], [0, 3, 2, 3], [2, 4, 1, 4],
  [1, 4, 1, 5], [1, 5, 3, 5], [3, 5, 3, 4], [3, 4, 5, 4],
  [5, 4, 5, 5], [4, 6, 4, 5], [4, 5, 6, 5],
]

interface L27State {
  tag: boolean[]
}

/** 被星星攻击到的格子：打叉、变红、不可点。 */
function markBlocked(game: GameCtx, id: number): void {
  const block = game.get(id)
  block.value = strValue('×')
  block.color = Color.rgb(255, 0, 0)
  block.clickable = false
}

const update = (s: L27State, game: GameCtx) => {
  forEachBlock(game, (block, i) => {
    if (s.tag[i]) {
      block.value = starValue()
      block.color = Color.black
    } else {
      block.value = strValue('')
    }
    block.clickable = true
  })
  for (const i of range(game.size)) {
    if (!s.tag[i]) continue
    const v = game.getVec(i)
    for (const near of near8(v)) {
      if (game.inArea(near)) markBlocked(game, game.getId(near))
    }
    for (const x of range(game.n)) {
      if (x !== v.x) markBlocked(game, game.getId(x, v.y))
    }
    for (const y of range(game.m)) {
      if (y !== v.y) markBlocked(game, game.getId(v.x, y))
    }
    for (const j of range(game.size)) {
      if (i !== j && AREA[i] === AREA[j]) markBlocked(game, j)
    }
  }
  game.tasks[0].set(count(s.tag, (x) => x))
}

const L27: Level<L27State> = {
  n: 6,
  m: 6,
  blockInnerSize: CONFIG.blockSize,
  headerMessage: '星之战',
  tasks: [[0, 6, Task.eq]],
  init(game) {
    const s: L27State = {
      tag: genArray(game.size, () => false),
    }
    fillBoard(game, { background: Color.white })
    for (const line of LINES) {
      drawGridRect(game.lines, new Vec(line[0]!, line[1]!), new Vec(line[2]!, line[3]!), {
        width: 2,
        color: Color.rgb(0, 100, 150),
      })
    }
    update(s, game)
    return s
  },
  click(s, id, game) {
    s.tag[id] = !s.tag[id]
    update(s, game)
  },
}

export default L27

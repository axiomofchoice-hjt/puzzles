import { fillBoard } from '@/game/board'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { count, genArray, rangeMatrix } from '@/game/tools'

interface L12State {
  tag: boolean[]
}

function update(s: L12State, game: GameCtx): void {
  fillBoard(game, (i) => ({ background: s.tag[i] ? Color.green : Color.grey }))
  game.tasks[1].set(count(s.tag, (x) => x))
  game.tasks[0].set(1)
  for (const [x, y] of rangeMatrix(game.n, game.m)) {
    // 十字的 5 格必须全部在盘内且未点亮
    const cross = [
      [x, y],
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ]
    if (cross.every(([px, py]) => game.inArea(px, py) && !s.tag[game.getId(px, py)])) {
      for (const [px, py] of cross) game.get(px, py).background = Color.yellow
      game.tasks[0].set(0)
      break
    }
  }
}

const L12: Level<L12State> = {
  n: 7,
  m: 8,
  headerMessage: '十字',
  tasks: [
    [0, 1, Task.eq],
    [0, 8, Task.le],
  ],
  init(game) {
    fillBoard(game, { clickable: true })
    const s: L12State = { tag: genArray(game.size, () => false) }
    update(s, game)
    return s
  },
  click(s, id, game) {
    s.tag[id] = !s.tag[id]!
    update(s, game)
  },
}

export default L12

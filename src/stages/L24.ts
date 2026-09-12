import { forEachBlock, nearIds } from '@/game/board'
import { strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { count, countRange, genArray, near4, range } from '@/game/tools'

interface L24State {
  tag: boolean[]
}

function update(s: L24State, game: GameCtx): void {
  let start = -1
  forEachBlock(game, (block, i) => {
    if (start === -1 && !s.tag[i]) start = i
    block.value = strValue('')
    block.background = s.tag[i] ? Color.blue : Color.grey
    block.clickable = count(nearIds(game, game.getVec(i)), (p) => s.tag[p]!) === 0
  })
  const queue = [start]
  const vis = genArray(game.size, () => false)
  vis[start] = true
  while (queue.length > 0) {
    const x = game.getVec(queue.shift()!)
    for (const p of near4(x)) {
      const pid = game.getId(p)
      if (game.inArea(p) && !vis[pid] && !s.tag[pid]) {
        vis[pid] = true
        queue.push(pid)
      }
    }
  }
  const separated = countRange(game.size, (i) => !vis[i] && !s.tag[i]) === 0
  if (!separated) {
    for (const i of range(game.size)) {
      if (vis[i]) game.get(i).value = strValue('×')
    }
  }
  game.tasks[1].set(+separated)
  game.tasks[0].set(count(s.tag, (x) => x))
}

const L24: Level<L24State> = {
  n: 6,
  m: 6,
  headerMessage: '数间',
  tasks: [
    [0, 12, Task.ge],
    [1, 1, Task.eq],
  ],
  init(game) {
    const s: L24State = { tag: genArray(game.size, () => false) }
    update(s, game)
    return s
  },
  click(s, id, game) {
    s.tag[id] = !s.tag[id]
    update(s, game)
  },
}

export default L24

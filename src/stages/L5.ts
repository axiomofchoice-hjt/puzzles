import { clearValues, fillBoard } from '@/game/board'
import { strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { enumerate, genArray, range } from '@/game/tools'

interface L5State {
  tag: boolean[]
}

function getLongestFrom(game: GameCtx, tag: boolean[], start: number): number[] {
  const queue = [start]
  const dis = genArray(game.size, () => -1)
  const last = genArray(game.size, () => -1)
  dis[start] = 0
  while (queue.length > 0) {
    const id = queue[0]!
    const { x, y } = game.getVec(id)
    queue.shift()
    for (const [px, py] of [
      [x, y + 1],
      [x + 1, y],
      [x, y - 1],
      [x - 1, y],
    ]) {
      const pid = game.getId(px, py)
      if (game.inArea(px, py) && tag[pid] && dis[pid] === -1) {
        dis[pid] = dis[id]! + 1
        last[pid] = id
        queue.push(pid)
      }
    }
  }
  let end = start
  for (const i of range(game.size)) {
    if (dis[end]! < dis[i]!) {
      end = i
    }
  }
  const res: number[] = []
  while (end !== -1) {
    res.push(end)
    end = last[end]!
  }
  res.reverse()
  return res
}

function update(game: GameCtx, tag: boolean[]): void {
  let longest: number[] = []
  for (const i of range(game.size)) {
    if (tag[i]) {
      const now = getLongestFrom(game, tag, i)
      if (now.length > longest.length) {
        longest = now
      }
    }
  }
  clearValues(game)
  for (const [i, id] of enumerate(longest)) {
    game.get(id).value = strValue((i + 1).toString())
  }
  game.tasks[0].set(longest.length)
}

const L5: Level<L5State> = {
  n: 8,
  m: 11,
  headerMessage: '直径',
  tasks: [
    [0, 54, Task.ge],
  ],
  init(game) {
    fillBoard(game, { clickable: true, background: Color.grey })
    const tag = genArray(game.size, () => true)
    for (const i of [0, 1, 11, 76, 86, 87]) {
      game.get(i).clickable = false
      game.get(i).opacity = 0
      tag[i] = false
    }
    update(game, tag)
    return { tag }
  },
  click(s, id, game) {
    s.tag[id] = !s.tag[id]!
    game.get(id).background = s.tag[id] ? Color.grey : Color.green
    update(game, s.tag)
  },
}

export default L5

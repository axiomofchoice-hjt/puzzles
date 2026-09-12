import { forEachBlock } from '@/game/board'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { count, genArray, range } from '@/game/tools'

interface L14State {
  tag: number[]
}

function dfs(game: GameCtx, id: number, vis: boolean[], rec: number[], nextTag: number[]): boolean {
  const [x, y] = game.getXY(id)
  if (vis[id]) return false
  vis[id] = true
  rec.push(id)
  let flag = false
  for (const [px, py] of [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ]) {
    if (game.inArea(px, py)) {
      const ptr = game.getId(px, py)
      if (nextTag[ptr] === 0) {
        flag = true
      }
      if (nextTag[ptr] === nextTag[id] && dfs(game, ptr, vis, rec, nextTag)) {
        flag = true
      }
    }
  }
  return flag
}

function kill(game: GameCtx, label: number, nextTag: number[]): void {
  const vis = genArray(game.size, () => false)
  for (const id of range(game.size)) {
    const rec: number[] = []
    if (nextTag[id] === label && !vis[id] && !dfs(game, id, vis, rec, nextTag)) {
      for (const r of rec) {
        nextTag[r] = 0
      }
    }
  }
}

function update(s: L14State, game: GameCtx): void {
  forEachBlock(game, (block, i) => {
    block.background = s.tag[i] === 0 ? Color.grey : s.tag[i] === 1 ? Color.black : Color.blue
    if (s.tag[i] !== 0) {
      block.clickable = false
      return
    }
    const nextTag = genArray(game.size, (x) => s.tag[x]!)
    nextTag[i] = 1
    kill(game, -1, nextTag)
    kill(game, 1, nextTag)
    block.clickable = nextTag[i] !== 0
  })
  game.tasks[0].set(count(s.tag, (x) => x === 1))
}

const L14: Level<L14State> = {
  n: 7,
  m: 7,
  headerMessage: '对称',
  tasks: [
    [0, 12, Task.ge],
  ],
  init(game) {
    const s: L14State = { tag: genArray(game.size, () => 0) }
    for (const i of [1, 2, 3, 4, 5]) {
      s.tag[game.getId(0, i)] = -1
      s.tag[game.getId(i, 0)] = -1
      s.tag[game.getId(6, i)] = -1
      s.tag[game.getId(i, 6)] = -1
    }
    s.tag[game.getId(3, 3)] = -1
    update(s, game)
    return s
  },
  click(s, id, game) {
    s.tag[id] = 1
    kill(game, -1, s.tag)
    kill(game, 1, s.tag)
    if (s.tag[game.size - 1 - id] === 0) {
      s.tag[game.size - 1 - id] = -1
      kill(game, 1, s.tag)
      kill(game, -1, s.tag)
    }
    update(s, game)
  },
}

export default L14

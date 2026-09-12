import { fillBoard } from '@/game/board'
import { Color } from '@/game/Color'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { genArray, range } from '@/game/tools'

interface L10State {
  tag: boolean[]
}

const L10: Level<L10State> = {
  n: 7,
  m: 7,
  headerMessage: '光',
  tasks: [
    [0, 13, Task.ge],
    [0, 13, Task.ge],
    [49, 13, Task.ge],
  ],
  init(game) {
    fillBoard(game, { clickable: true, background: Color.yellow })
    return { tag: genArray(game.size, () => false) }
  },
  click(s, id, game) {
    s.tag[id] = !s.tag[id]!
    for (const task of game.tasks) task.set(0)

    const vis = genArray(game.size, () => false)

    for (const j of range(game.m)) {
      for (const i of range(game.n)) {
        const ptr = game.getId(i, j)
        if (s.tag[ptr]) break
        if (!vis[ptr]) {
          vis[ptr] = true
          game.get(ptr).background = Color.yellow
          game.tasks[2].add(1)
        }
      }
    }
    for (const i of range(game.n)) {
      for (const j of range(game.m)) {
        const ptr = game.getId(i, j)
        if (s.tag[ptr]) break
        if (!vis[ptr]) {
          vis[ptr] = true
          game.get(ptr).background = Color.blue
          game.tasks[1].add(1)
        }
      }
    }
    for (const i of range(game.size)) {
      if (vis[i]) continue
      game.get(i).background = s.tag[i] ? Color.black : Color.grey
      game.tasks[0].add(s.tag[i] ? 0 : 1)
    }
  },
}

export default L10

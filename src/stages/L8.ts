import { fillBoard } from '@/game/board'
import { arrowValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { genArray, random, range, rangeMatrix } from '@/game/tools'
import { Vec } from '@/game/Vec'

interface L8State {
  tag: boolean[][]
}

const update = (s: L8State, game: GameCtx) => {
  let cnt = 0
  for (const [i, j] of rangeMatrix(4, 3)) {
    if (s.tag[i]![j] === s.tag[i]![j + 4]!) {
      cnt++
    }
  }
  game.tasks[0].set(cnt)
}

const L8: Level<L8State> = {
  n: 4,
  m: 7,
  headerMessage: '开关',
  tasks: [[7, 12, Task.eq]],
  init(game) {
    const s: L8State = {
      tag: genArray(game.n, () => genArray(game.m, () => false)),
    }
    const find = (check: (x: number, y: number) => boolean): [number, number] => {
      let x = random(4),
        y = random(3)
      while (!check(x, y)) {
        x = random(4)
        y = random(3)
      }
      return [x, y]
    }
    fillBoard(game, { clickable: false, background: Color.grey })
    range(6).forEach(() => {
      const [x, y] = find((x, y) => !s.tag[x]![y])
      s.tag[x]![y] = s.tag[x]![y + 4] = true
    })
    range(5).forEach(() => {
      const [x, y] = find((x, y) => s.tag[x]![y] === s.tag[x]![y + 4]!)
      s.tag[x]![y] = !s.tag[x]![y]!
    })
    for (const i of range(game.n)) {
      game.get(i, 3).opacity = 0
    }
    game.get(2, 3).opacity = 1
    game.get(2, 3).value = arrowValue(90)
    game.get(2, 3).background = Color.white
    game.get(2, 3).pos = new Vec(1.5, 3)

    for (const [i, j] of rangeMatrix(game.n, game.m)) {
      if (j < 3) {
        game.get(i, j).clickable = true
      }
      if (j != 3) {
        game.get(i, j).background = s.tag[i]![j] ? Color.grey : Color.green
      }
    }
    return s
  },
  click(s, id, game) {
    for (const [i, j] of rangeMatrix(4, 3)) {
      if (game.getId(i, j) !== id) {
        s.tag[i]![j] = !s.tag[i]![j]!
        game.get(i, j).background = s.tag[i]![j] ? Color.grey : Color.green
      }
    }
    update(s, game)
  },
}

export default L8

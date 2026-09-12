import { fillBoard } from '@/game/board'
import { strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Key } from '@/game/Key'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { genArray, near4 } from '@/game/tools'
import { Vec } from '@/game/Vec'

const Init = {
  player: [new Vec(6, 6), new Vec(6, 5), new Vec(6, 4)],
  walls: [
    new Vec(0, 0),
    new Vec(0, 5),
    new Vec(5, 1),
    new Vec(5, 2),
    new Vec(5, 3),
    new Vec(5, 4),
    new Vec(5, 6),
    new Vec(3, 3),
  ],
  foods: [
    new Vec(6, 2),
    new Vec(6, 1),
    new Vec(5, 0),
    new Vec(5, 5),
    new Vec(0, 1),
    new Vec(0, 4),
    new Vec(0, 6),
    new Vec(4, 1),
    new Vec(1, 5),
    new Vec(2, 5),
    new Vec(1, 4),
    new Vec(1, 1),
    new Vec(3, 4),
    new Vec(3, 6),
    new Vec(3, 2),
    new Vec(4, 2),
  ],
}

interface L25State {
  player: Vec[]
  foods: Vec[]
}

const head = (s: L25State): Vec => s.player[s.player.length - 1] as Vec

const clickable = (s: L25State, i: Vec, game: GameCtx): boolean => {
  return (
    game.inArea(i) &&
    !Init.walls.some((j) => Vec.equal(i, j)) &&
    !s.player.some((j) => Vec.equal(i, j))
  )
}

const update = (s: L25State, game: GameCtx) => {
  fillBoard(game, { clickable: false, background: Color.grey, color: Color.black, value: strValue('') })
  for (const i of s.player) {
    game.get(i).background = Color.blue
  }
  game.get(s.player[s.player.length - 2] as Vec).immediate = strValue('')
  game.get(head(s)).immediate = strValue('P')
  game.get(head(s)).value = strValue('P')
  for (const i of Init.walls) {
    game.get(i).background = Color.black
    game.get(i).color = Color.white
    game.get(i).value = strValue('×')
  }
  for (const i of s.foods) {
    game.get(i).background = Color.yellow
  }
  for (const i of near4(head(s))) {
    if (clickable(s, i, game)) {
      game.get(i).clickable = true
    }
  }
}

const doClick = (s: L25State, id: number, game: GameCtx) => {
  const food = s.foods.findIndex((x) => game.getId(x) === id)
  if (food !== -1) {
    s.foods.splice(food, 1)
    s.player.shift()
    game.tasks[0].add(1)
  }
  s.player.push(game.getVec(id))
  update(s, game)
}

const L25: Level<L25State> = {
  n: 7,
  m: 7,
  tip: '可以用方向键',
  headerMessage: '贪吃蛇',
  tasks: [[0, 16, Task.eq]],
  init(game) {
    const s: L25State = {
      player: genArray(Init.player.length, (i) => Init.player[i] as Vec),
      foods: genArray(Init.foods.length, (i) => Init.foods[i] as Vec),
    }
    update(s, game)
    return s
  },
  click(s, id, game) {
    doClick(s, id, game)
  },
  key(s, key: Key, game) {
    const to = Vec.add(key.direction(), head(s))
    if (key.isDirection() && clickable(s, to, game)) {
      doClick(s, game.getId(to), game)
    }
  },
}

export default L25

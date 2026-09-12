import { fillBoard } from '@/game/board'
import { arrowValue, numValue, strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { range } from '@/game/tools'
import { Vec } from '@/game/Vec'

const VERTICES: Vec[] = [
  new Vec(2, 0),
  new Vec(2, 4),
  new Vec(2, 8),
  new Vec(6, 4),
]
interface Edge {
  pos: Vec
  from: number
  to: number
  value: number
  arrows: [Vec, number][]
}
const EDGES_GEN: () => Edge[] = () => [
  { pos: new Vec(2, 2), from: 0, to: 1, value: 1, arrows: [[new Vec(2, 1), 90], [new Vec(2, 3), 90]] },
  { pos: new Vec(4, 2), from: 0, to: 3, value: 4, arrows: [[new Vec(3, 1), 135], [new Vec(5, 3), 135]] },
  { pos: new Vec(0, 2), from: 1, to: 0, value: Infinity, arrows: [[new Vec(1, 1), 225], [new Vec(1, 3), 315]] },
  { pos: new Vec(2, 6), from: 1, to: 2, value: 1, arrows: [[new Vec(2, 5), 90], [new Vec(2, 7), 90]] },
  { pos: new Vec(0, 6), from: 2, to: 1, value: Infinity, arrows: [[new Vec(1, 5), 225], [new Vec(1, 7), 315]] },
  { pos: new Vec(4, 4), from: 3, to: 1, value: 1, arrows: [[new Vec(3, 4), 0], [new Vec(5, 4), 0]] },
  { pos: new Vec(4, 6), from: 3, to: 2, value: -2, arrows: [[new Vec(3, 7), 45], [new Vec(5, 5), 45]] },
]

interface L19State {
  player: number
  edges: Edge[]
}

const update = (s: L19State, game: GameCtx) => {
  game.get(game.size).pos = VERTICES[s.player]!
  for (const to of range(VERTICES.length)) {
    game.get(VERTICES[to]!).clickable =
      s.edges.findIndex((e) => e.from === s.player && e.to === to && e.value !== 0) !== -1
    game.get(VERTICES[to]!).opacity = +(s.player !== to)
  }
  for (const { pos, value } of s.edges) {
    game.get(pos).opacity = +(value !== 0)
    game.get(pos).background = value >= 0 ? Color.grey : Color.green
    game.get(pos).value =
      value === Infinity ? strValue('∞') : value === 0 ? strValue('') : numValue(Math.abs(value))
  }
}

const L19: Level<L19State> = {
  n: 7,
  m: 9,
  headerMessage: '爱心',
  tasks: [[0, 7, Task.eq]],
  init(game) {
    fillBoard(game, { clickable: false, opacity: 0 })
    const s: L19State = {
      player: 0,
      edges: EDGES_GEN(),
    }
    for (const { arrows } of s.edges) {
      for (const [pos, v] of arrows) {
        game.get(pos).opacity = 1
        game.get(pos).background = Color.white
        game.get(pos).value = arrowValue(v)
      }
    }
    for (const pos of VERTICES) {
      game.get(pos).opacity = 1
      game.get(pos).background = Color.grey
    }
    for (const { pos } of s.edges) {
      game.get(pos).round = true
    }
    game.addBlock({
      background: Color.blue,
      value: strValue('P'),
    })
    update(s, game)
    return s
  },
  click(s, id, game) {
    id = VERTICES.findIndex((v) => Vec.equal(game.getVec(id), v))
    const edge = s.edges.find((e) => e.from === s.player && e.to === id && e.value !== 0)!
    s.player = id
    if (edge.value >= 0) {
      edge.value--
    } else {
      edge.value++
      if (edge.value === 0) {
        for (const e of s.edges) {
          if (e.value === Infinity) {
            e.value = 1
          }
        }
      }
    }
    if (edge.value === 0) {
      for (const [pos] of edge.arrows) {
        game.get(pos).opacity = 0
      }
      game.tasks[0].add(1)
    }
    update(s, game)
  },
}

export default L19

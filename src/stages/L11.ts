import { arrowValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import { drawGridRect } from '@/game/Line'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { genArray, range, rangeMatrix } from '@/game/tools'
import { Vec } from '@/game/Vec'

const BLOCKS: [number, number][] = [
  [1, 2],
  [2, 1],
  [2, 2],
  [4, 1],
  [4, 2],
  [4, 3],
  [1, 4],
  [2, 4],
  [3, 4],
]

type Arm = [number, number, number, number]

interface L11State {
  tag: number[]
  btn: Map<number, Arm>
}

/** 造一个黄色箭头按钮：点击后按 `order` 的顺序把方块整体推移一格。 */
function addArm(s: L11State, game: GameCtx, pos: Vec, rotate: number, order: [number, number][]): void {
  const id = game.addBlock({ pos, background: Color.yellow, value: arrowValue(rotate) }).id
  s.btn.set(id, order.map(([x, y]) => game.getId(x, y)) as Arm)
}

const update = (s: L11State, game: GameCtx) => {
  for (const [id, arr] of s.btn) {
    game.get(id).clickable = s.tag[arr[0]] === -1
  }
  game.tasks[0].set(0)
  for (const [i, j] of rangeMatrix(3, 3)) {
    if (s.tag[game.getId(i + 1, j + 1)] !== -1) {
      game.tasks[0].add(1)
    }
  }
}

const L11: Level<L11State> = {
  n: 6,
  m: 6,
  noBlock: true,
  headerMessage: '平移',
  tasks: [[3, 9, Task.eq]],
  init(game) {
    const s: L11State = {
      tag: genArray(game.size, () => -1),
      btn: new Map(),
    }
    for (const [x, y] of BLOCKS) {
      s.tag[game.getId(x, y)] = game.addBlock({
        pos: new Vec(x, y),
        background: Color.green,
      }).id
    }
    // 四条边各一个方向按钮，各自负责把所在行列推向对侧
    for (const i of [1, 2, 3, 4]) {
      addArm(s, game, new Vec(0, i), 0, [
        [1, i],
        [2, i],
        [3, i],
        [4, i],
      ])
      addArm(s, game, new Vec(i, 5), 90, [
        [i, 4],
        [i, 3],
        [i, 2],
        [i, 1],
      ])
      addArm(s, game, new Vec(5, i), 180, [
        [4, i],
        [3, i],
        [2, i],
        [1, i],
      ])
      addArm(s, game, new Vec(i, 0), 270, [
        [i, 1],
        [i, 2],
        [i, 3],
        [i, 4],
      ])
    }
    drawGridRect(game.lines, new Vec(1, 1), new Vec(4, 4), { width: 2, color: Color.blue })
    update(s, game)
    return s
  },
  click(s, id, game) {
    const arr = s.btn.get(id) as Arm
    for (const i of range(3)) {
      const pos1 = arr[i]
      const pos2 = arr[i + 1]
      if (s.tag[pos2] !== -1) {
        s.tag[pos1] = s.tag[pos2]
        s.tag[pos2] = -1
        game.get(s.tag[pos1]).pos = game.getVec(pos1)
      }
    }
    update(s, game)
  },
}

export default L11

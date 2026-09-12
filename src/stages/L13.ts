import { fillBoard } from '@/game/board'
import { arrowValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { countRange, genArray, range, sum } from '@/game/tools'

const L_IDS = [0, 1, 2, 3, 12, 21, 30, 39, 48, 57, 56, 55, 54, 45, 36, 27, 18, 9]
const R_IDS = L_IDS.map((x) => x + 5)
const R_TAG = [1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1]

interface L13State {
  tag: number[]
}

function update(s: L13State, game: GameCtx): void {
  for (const i of range(18)) {
    game.get(L_IDS[i]!).clickable = s.tag[i] === 0
    game.get(L_IDS[i]!).background = s.tag[i] ? Color.yellow : Color.grey
  }
  game.tasks[0].set(countRange(18, (x) => s.tag[x] === R_TAG[x]))
}

const L13: Level<L13State> = {
  n: 7,
  m: 9,
  headerMessage: '找不同',
  tasks: [
    [10, 18, Task.eq],
  ],
  init(game) {
    const s: L13State = { tag: genArray(game.size, () => 0) }
    s.tag[0] = 1
    fillBoard(game, { clickable: false, background: Color.white })
    for (const i of range(18)) {
      game.get(R_IDS[i]!).background = R_TAG[i] ? Color.yellow : Color.grey
    }
    game.get(31).value = arrowValue(90)
    update(s, game)
    return s
  },
  click(s, id, game) {
    let index = L_IDS.findIndex((x) => x === id)
    s.tag[index] = 1
    if (sum(s.tag) !== 18) {
      for (let k = 0; k < 3; k++) {
        index = (index + 1) % 18
        while (s.tag[index]) {
          index = (index + 1) % 18
        }
      }
      s.tag[index] = 1
    }
    update(s, game)
  },
}

export default L13

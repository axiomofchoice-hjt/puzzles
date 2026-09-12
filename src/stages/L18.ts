import { arrowValue, strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { GameCtx } from '@/game/GameCtx'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { genArray, random, sum, sumBy } from '@/game/tools'
import { Vec } from '@/game/Vec'

/** 每堆最多 5 张牌；第 NUM_PILES 个方块是"确认"按钮。 */
const NUM_PILES = 5

interface L18State {
  tag: number[]
  used: boolean[]
  whoLastMove: number[] // 0 未赋值 1 玩家 -1 电脑
}

const hasUsed = (s: L18State): boolean => s.used.some(Boolean)

/** 给"已经空掉且尚未归属"的堆打上归属标记；玩家回合额外计入任务进度。 */
function claimEmptyPiles(s: L18State, game: GameCtx, who: 1 | -1): void {
  for (let i = 0; i < NUM_PILES; i++) {
    if (s.whoLastMove[i] === 0 && s.tag[i] === 0) {
      s.whoLastMove[i] = who
      if (who === 1) game.tasks[0].add(1)
    }
  }
}

const update = (s: L18State, game: GameCtx) => {
  for (let i = 0; i < NUM_PILES; i++) {
    game.get(i).pos = new Vec(NUM_PILES - s.tag[i]!, i)
    if (s.used[i]) {
      game.get(i).background = Color.blue
      game.get(i).clickable = true
    } else if (s.tag[i] === 0) {
      game.get(i).background = Color.grey
      game.get(i).clickable = false
    } else {
      game.get(i).background = Color.yellow
      game.get(i).clickable = true
    }
    game.get(i).value = strValue(s.whoLastMove[i] === 1 ? 'ok' : '')
  }
  const used = hasUsed(s)
  game.get(NUM_PILES).clickable = used
  game.get(NUM_PILES).background = used ? Color.yellow : Color.grey
  for (let i = NUM_PILES + 1; i < game.blocks.length; i++) {
    game.get(i).opacity = +(NUM_PILES - game.get(i).pos.x < s.tag[game.get(i).pos.y]!)
  }
}

const doClick = (s: L18State, id: number, game: GameCtx): void => {
  if (id === NUM_PILES) {
    claimEmptyPiles(s, game, 1)
    s.used = genArray(NUM_PILES, () => false)
    if (sum(s.tag) !== 0) {
      if (sumBy(s.tag, (x) => x % 2)) {
        // AI win state
        for (let i = 0; i < NUM_PILES; i++) {
          if (s.tag[i]! % 2) s.tag[i]--
        }
      } else {
        // Player win state：随机让若干非空堆各减一，至少成功一次
        let ok = false
        while (!ok) {
          for (let i = 0; i < NUM_PILES; i++) {
            if (s.tag[i] !== 0 && random(2)) {
              ok = true
              s.tag[i]--
            }
          }
        }
      }
    }
    claimEmptyPiles(s, game, -1)
  } else {
    if (!s.used[id]) {
      s.tag[id]!--
    } else {
      s.tag[id]!++
    }
    s.used[id] = !s.used[id]
  }
  update(s, game)
}

const L18: Level<L18State> = {
  n: 7,
  m: 5,
  noBlock: true,
  headerMessage: '博弈',
  tasks: [[0, 5, Task.ge]],
  init(game) {
    const s: L18State = {
      tag: [4, 5, 3, 2, 4],
      used: genArray(NUM_PILES, () => false),
      whoLastMove: genArray(NUM_PILES, () => 0),
    }
    for (let k = 0; k < NUM_PILES; k++) {
      game.addBlock()
    }
    game.addBlock({
      pos: new Vec(6, 2),
      value: arrowValue(90),
    })
    for (let i = 0; i < NUM_PILES; i++) {
      for (let j = 0; j < s.tag[i]!; j++) {
        game.addBlock({
          pos: new Vec(NUM_PILES - j, i),
          background: Color.grey,
        })
      }
    }
    update(s, game)
    return s
  },
  click: doClick,
  key(s, _key, game) {
    if (hasUsed(s)) {
      doClick(s, NUM_PILES, game)
    }
  },
}

export default L18

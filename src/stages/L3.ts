import { box9Ids, fillBoard } from '@/game/board'
import { strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { count, genArray, range } from '@/game/tools'

interface L3State {
  tag: boolean[]
}

const L3: Level<L3State> = {
  n: 5,
  m: 5,
  headerMessage: '扫雷',
  tasks: [
    [0, 8, Task.eq],
  ],
  init(game) {
    fillBoard(game, { clickable: true, background: Color.grey })
    return { tag: genArray(game.size, () => false) }
  },
  click(s, id, game) {
    s.tag[id] = !s.tag[id]!
    game.get(id).background = s.tag[id] ? Color.green : Color.grey
    const appear = genArray(8, () => false)

    for (const p of range(game.size)) {
      if (s.tag[p]) {
        game.get(p).value = strValue('')
        continue
      }
      // 周围一圈里被点开的格子数（含自身，但自身未点开，不影响结果）
      const cnt = count(box9Ids(game, game.getVec(p)), (t) => s.tag[t]!)
      game.get(p).value = strValue(cnt === 0 ? '' : String(cnt))
      if (cnt > 0) appear[cnt - 1] = true
    }
    game.tasks[0].set(count(appear, (x) => x))
  },
}

export default L3

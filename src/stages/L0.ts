import { fillBoard } from '@/game/board'
import { arrowValue, emptyValue, numValue, strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'

interface L0State {
  L: number
  R: number
}

const L0: Level<L0State> = {
  n: 4,
  m: 8,
  headerMessage: '猜数',
  tasks: [
    [0, 1, Task.ge],
    [0, 5, Task.leIncreasing],
  ],
  init(game) {
    // 最后一格是"结果"格，不参与猜数
    fillBoard(game, (id) =>
      id < game.size - 1
        ? { value: numValue(id + 1), clickable: true, background: Color.grey }
        : { clickable: false, background: Color.white },
    )
    return { L: 0, R: game.size - 2 }
  },
  click(s, id, game) {
    const block = game.get(id)
    block.clickable = false
    block.immediate = emptyValue()
    game.tasks[1].add(1)
    if (id === s.L && id === s.R) {
      block.value = strValue('ok')
      block.background = Color.red
      game.tasks[0].set(1)
    } else if ((id * 2 === s.L + s.R && Math.random() < 0.5) || id * 2 < s.L + s.R) {
      block.value = arrowValue(270)
      block.background = Color.yellow
      block.rotate += 180
      if (s.L <= id && id <= s.R) s.L = id + 1
    } else {
      block.value = arrowValue(90)
      block.background = Color.blue
      block.rotate -= 180
      if (s.L <= id && id <= s.R) s.R = id - 1
    }
  },
}

export default L0

import { fillBoard } from '@/game/board'
import { strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { genArray, random } from '@/game/tools'

interface L7State {
  tag: number[]
}

const L7: Level<L7State> = {
  n: 6,
  m: 8,
  headerMessage: '二进制',
  tasks: [[0, 2000, Task.eq]],
  init(game) {
    const s: L7State = { tag: genArray(game.size, () => 0) }
    fillBoard(game, { clickable: false, background: Color.grey })
    const gen = (tag: number, color: Color, value: string) => {
      let id = random(game.size)
      while (s.tag[id]) {
        id = random(game.size)
      }
      s.tag[id] = tag
      game.get(id).background = color
      game.get(id).value = strValue(value)
      game.get(id).clickable = true
    }
    for (let i = 0; i < 2; i++) gen(-1, Color.red, '-1')
    for (let i = 0; i < 2; i++) gen(1, Color.green, '+1')
    for (let i = 0; i < 10; i++) gen(2, Color.yellow, '×2')
    return s
  },
  click(s, id, game) {
    if (s.tag[id] === 2) {
      game.tasks[0].set(game.tasks[0].now * 2)
    } else {
      game.tasks[0].add(s.tag[id])
    }
    s.tag[id] = 0
    game.get(id).background = Color.grey
    game.get(id).value = strValue('')
    game.get(id).clickable = false
  },
}

export default L7

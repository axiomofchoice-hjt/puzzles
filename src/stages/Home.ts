import { forEachBlock } from '@/game/board'
import { numValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'

const Home: Level<null> = {
  n: (stageCount) => Math.ceil(stageCount / 5),
  m: 5,
  headerMessage: '选关',
  tip: '关卡难度没有单调性',
  hideBack: true,
  init(game) {
    game.setTasks([[game.progress.count(), game.stageCount, Task.ge]])
    forEachBlock(game, (block, i) => {
      if (i >= game.stageCount) {
        block.background = Color.white
        return
      }
      block.value = numValue(i + 1)
      block.clickable = true
      block.background = game.progress.get(i) ? Color.yellow : Color.grey
    })
    return null
  },
}

export default Home

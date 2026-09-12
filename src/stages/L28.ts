import { forEachBlock } from '@/game/board'
import { chessValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import { CONFIG } from '@/game/Config'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { Vec } from '@/game/Vec'

/** 棋盘格底色。 */
const checker = (x: number, y: number): Color => ((x + y) % 2 ? Color.grey : Color.white)

interface L28State {
  choose: boolean
}

const L28: Level<L28State> = {
  n: 8,
  m: 8,
  blockInnerSize: CONFIG.blockSize,
  headerMessage: '独棋',
  tasks: [[0, 5, Task.eq]],
  init(game) {
    const s: L28State = { choose: false }
    forEachBlock(game, (block, i) => {
      const [x, y] = game.getXY(i)
      block.background = checker(x, y)
      block.color = Color.black
    })
    const set = (x: number, y: number, value: string) => {
      game.addBlock({
        size: CONFIG.blockSize,
        pos: new Vec(x, y),
        value: chessValue(value),
        color: Color.black,
        clickable: true,
        backgroundOpacity: 0,
      })
    }
    set(5, 2, 'knight')
    set(5, 3, 'knight')
    set(4, 3, 'pawn')
    set(4, 4, 'pawn')
    set(2, 5, 'pawn')
    set(3, 4, 'rook')
    return s
  },
  click(s, id, game) {
    const { x, y } = game.get(id).pos
    if (!s.choose) {
      game.get(x, y).background = Color.yellow
      for (const chess of game.blocks) {
        if (!chess.value.isChess()) continue
        const kind = game.get(id).value.str
        if (
          (kind === 'pawn' && chess.pos.x === x - 1 && Math.abs(chess.pos.y - y) === 1) ||
          (kind === 'knight' && Math.abs(chess.pos.x - x) + Math.abs(chess.pos.y - y) === 3) ||
          (kind === 'rook' && (chess.pos.x === x) !== (chess.pos.y === y))
        ) {
          game.get(chess.pos.x, chess.pos.y).background = Color.blue
        }
      }
    } else {
      if (game.get(x, y).background.equal(Color.blue)) {
        game.get(id).opacity = 0
        game.get(id).clickable = false
        for (const chess of game.blocks) {
          if (chess.value.isChess() && game.get(chess.pos.x, chess.pos.y).background.equal(Color.yellow)) {
            chess.pos = new Vec(x, y)
          }
        }
        game.tasks[0].add(1)
      }
      for (const block of game.blocks) {
        block.background = checker(block.pos.x, block.pos.y)
      }
    }
    s.choose = !s.choose
  },
}

export default L28

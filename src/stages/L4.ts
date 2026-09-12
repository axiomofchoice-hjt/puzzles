import { strValue } from '@/game/BlockValue'
import { Color } from '@/game/Color'
import { CONFIG } from '@/game/Config'
import { Frac } from '@/game/Frac'
import type { GameCtx } from '@/game/GameCtx'
import { drawRect } from '@/game/Line'
import type { Level } from '@/game/level'
import { Task } from '@/game/Task'
import { enumerate, range } from '@/game/tools'
import { Vec } from '@/game/Vec'
import type { Key } from '@/game/Key'

export { Frac }

/** 运算符方块上的符号，按方向键 / 点击时的分派表。 */
const OP_SIGNS = ['+', '-', '×', '÷']
const OPS: Record<string, (a: Frac, b: Frac) => Frac> = {
  '+': Frac.add,
  '-': Frac.sub,
  '×': Frac.mul,
  '÷': Frac.div,
}

interface L4State {
  nums: number[]
  opts: number[]
  lhs: [number | null, number | null, number | null]
  rhs: number
  fracs: (Frac | undefined)[]
  arrow: number
}

const update = (s: L4State, game: GameCtx) => {
  const arrowAvailable = s.lhs.every((x) => x !== null)
  s.nums.sort((x, y) => Frac.compare(s.fracs[x] as Frac, s.fracs[y] as Frac))
  s.opts = [...s.opts].sort((x, y) => x - y)

  for (const [i, num] of enumerate(s.nums)) {
    game.get(num).pos = new Vec(1, i + (5 - s.nums.length) / 2)
    game.get(num).value = strValue(s.fracs[num]?.toString() ?? '')
    game.get(num).clickable = s.lhs[0] === null || s.lhs[2] === null
  }
  for (const [i, opt] of enumerate(s.opts)) {
    game.get(opt).pos = new Vec(2, i + (5 - s.opts.length) / 2)
    game.get(opt).clickable = s.lhs[1] === null
  }
  for (const [i, item] of enumerate(s.lhs)) {
    if (item !== null) {
      game.get(item).pos = new Vec(0, i)
      game.get(item).clickable = true
      if (i !== 1) {
        game.get(item).value = strValue(s.fracs[item]?.toString() ?? '')
      }
    }
  }

  game.get(s.rhs).pos = new Vec(0, 4)
  game.get(s.rhs).opacity = +arrowAvailable
  game.get(s.rhs).clickable = arrowAvailable
  if (arrowAvailable) {
    const optStr = game.get(s.lhs[1] as number).value.str
    const opt = OPS[optStr] ?? Frac.div
    s.fracs[s.rhs] = opt(s.fracs[s.lhs[0] as number] as Frac, s.fracs[s.lhs[2] as number] as Frac)
    game.get(s.rhs).value = strValue(s.fracs[s.rhs]?.toString() ?? '')
  } else {
    s.fracs[s.rhs] = undefined
    game.get(s.rhs).value = strValue('')
  }
  if (
    s.nums.length === 1 &&
    game.get(s.nums[0] as number).value.str === '24' &&
    s.lhs.every((x) => x === null)
  ) {
    game.tasks[0].set(1)
  }
}

const doClickRhs = (s: L4State, game: GameCtx) => {
  if (s.fracs[s.rhs]?.toString() === '★') {
    game.showBonus('这不是一个数')
  }
  game.get(s.lhs[0] as number).opacity = 0
  game.get(s.lhs[2] as number).opacity = 0
  s.opts.push(s.lhs[1] as number)
  s.nums.push(s.rhs)
  s.rhs = game
    .addBlock({
      background: Color.grey,
      opacity: 0,
    })
    .id
  s.lhs = [null, null, null]
}

const doClick = (s: L4State, id: number, game: GameCtx) => {
  if (s.lhs[0] === null || s.lhs[2] === null) {
    const index = s.nums.findIndex((x) => x === id)
    if (index !== -1) {
      if (s.lhs[0] === null) {
        s.lhs[0] = s.nums[index] as number
      } else {
        s.lhs[2] = s.nums[index] as number
      }
      s.nums.splice(index, 1)
      return
    }
  }
  if (s.lhs[1] === null) {
    const index = s.opts.findIndex((x) => x === id)
    if (index !== -1) {
      s.lhs[1] = s.opts[index] as number
      s.opts.splice(index, 1)
      return
    }
  }
  {
    const index = s.lhs.findIndex((x) => x === id)
    if (index !== -1) {
      if (index % 2 === 0) {
        s.nums.push(s.lhs[index] as number)
      } else {
        s.opts.push(s.lhs[index] as number)
      }
      s.lhs[index] = null
      return
    }
  }
  if (s.rhs === id) {
    doClickRhs(s, game)
    return
  }
}

const L4: Level<L4State> = {
  n: 3,
  m: 5,
  noBlock: true,
  headerMessage: '24 点',
  tasks: [[0, 1, Task.eq]],
  init(game) {
    const s: L4State = {
      nums: [],
      opts: [],
      lhs: [null, null, null],
      fracs: [],
      arrow: 0,
      rhs: 0,
    }
    const initNums = Math.random() < 0.5 ? [1, 5, 5, 5] : [3, 3, 7, 7]
    for (const i of range(4)) {
      const id = game
        .addBlock({
          background: Color.grey,
        })
        .id
      s.nums.push(id)
      s.fracs[id] = new Frac(initNums[i] as number, 1, 1)
    }
    for (const i of range(4)) {
      s.opts.push(
        game
          .addBlock({
            background: Color.grey,
            value: strValue(OP_SIGNS[i] as string),
          })
          .id,
      )
    }
    s.arrow = game
      .addBlock({
        background: Color.white,
        value: strValue('='),
        pos: new Vec(0, 3),
      })
      .id
    s.rhs = game
      .addBlock({
        background: Color.grey,
        opacity: 0,
      })
      .id

    for (const i of range(3)) {
      drawRect(
        game.lines,
        CONFIG.blockGap + 1,
        CONFIG.blockGap + i * CONFIG.blockSize + 1,
        CONFIG.blockSize - 1,
        CONFIG.blockSize * (i + 1) - 1,
        {
          width: 2,
          color: Color.blue,
        },
      )
    }

    update(s, game)
    return s
  },
  click(s, id, game) {
    doClick(s, id, game)
    update(s, game)
  },
  key(s, key: Key, game) {
    const work = (optStr: string) => {
      if (s.lhs[1] !== null) {
        s.opts.push(s.lhs[1] as number)
        s.lhs[1] = null
      }
      for (const i of range(s.opts.length)) {
        if (game.get(s.opts[i] as number).value.str === optStr) {
          s.lhs[1] = s.opts[i] as number
          s.opts.splice(i, 1)
          break
        }
      }
    }
    if (key.isAdd()) {
      work('+')
    }
    if (key.isSub()) {
      work('-')
    }
    if (key.isMul()) {
      work('×')
    }
    if (key.isDiv()) {
      work('÷')
    }
    if (key.isEnter() || key.isEqual()) {
      const arrowAvailable = s.lhs.every((x) => x !== null)
      if (arrowAvailable) {
        doClickRhs(s, game)
      }
    }
    update(s, game)
  },
}

export default L4
